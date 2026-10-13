import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { client, login, longText, setupApp } from './helpers.js';

let ctx;
beforeAll(async () => { ctx = await setupApp(); });
afterAll(async () => { await ctx.close(); });

describe('cart, checkout and orders', () => {
  it('requires login for the cart, checkout, orders and profile', async () => {
    for (const url of ['/api/cart', '/api/orders', '/api/profile', '/api/checkout/payment-methods']) {
      expect((await ctx.app.inject({ url })).statusCode).toBe(401);
    }
  });

  it('adds, updates and removes cart items with stock checks', async () => {
    const c = client(ctx.app, await login(ctx.app, 'alice'));
    expect((await c.get('/api/cart')).json()).toEqual({ items: [], totalQty: 0, totalPrice: 0 });

    // Elden Ring (game 1) has 4 keys left after the seed orders.
    let cart = (await c.post('/api/cart', { gameId: 1 })).json();
    expect(cart.items[0]).toMatchObject({ gameId: 1, quantity: 1, price: 29.99 });

    cart = (await c.post('/api/cart', { gameId: 1 })).json();
    expect(cart.totalQty).toBe(2);
    cart = (await c.patch('/api/cart/1', { action: 'increase' })).json();
    cart = (await c.patch('/api/cart/1', { action: 'increase' })).json();
    expect(cart.items[0].quantity).toBe(4);

    expect((await c.patch('/api/cart/1', { action: 'increase' })).statusCode).toBe(409);
    expect((await c.post('/api/cart', { gameId: 1 })).statusCode).toBe(409);

    cart = (await c.patch('/api/cart/1', { action: 'decrease' })).json();
    expect(cart.items[0].quantity).toBe(3);
    for (let i = 0; i < 5; i += 1) cart = (await c.patch('/api/cart/1', { action: 'decrease' })).json();
    expect(cart.items[0].quantity).toBe(1);

    expect((await c.patch('/api/cart/2', { action: 'increase' })).statusCode).toBe(400);
    expect((await c.patch('/api/cart/1', { action: 'explode' })).statusCode).toBe(400);
    expect((await c.post('/api/cart', { gameId: 99999 })).statusCode).toBe(404);

    cart = (await c.delete('/api/cart/1')).json();
    expect(cart.items).toEqual([]);
  });

  it('checks out the cart, assigns keys and records the order', async () => {
    const c = client(ctx.app, await login(ctx.app, 'bob'));
    expect((await c.post('/api/checkout', { paymentMethod: 'QR' })).statusCode).toBe(400);

    await c.post('/api/cart', { gameId: 2 });
    await c.post('/api/cart', { gameId: 2 });
    await c.post('/api/cart', { gameId: 4 });
    const methods = (await c.get('/api/checkout/payment-methods')).json();
    expect(methods.map((m) => m.id)).toEqual(['QR', 'TRUEMONEY']);

    const before = await ctx.db.one('SELECT total_spend FROM users WHERE username = $1', ['bob_plays']);
    const res = await c.post('/api/checkout', { paymentMethod: 'TRUEMONEY' });
    expect(res.statusCode).toBe(201);
    const { orderId, totalAmount } = res.json();

    const order = await ctx.db.one('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    expect(order).toMatchObject({ payment_method: 'TRUEMONEY', payment_status: 'pending', total_amount: totalAmount });
    const sold = await ctx.db.query(
      "SELECT dk.* FROM digital_keys dk JOIN order_items oi ON oi.digital_key_id = dk.digital_key_id WHERE oi.order_id = $1 AND dk.status = 'sold'",
      [orderId],
    );
    expect(sold).toHaveLength(3);
    const after = await ctx.db.one('SELECT total_spend FROM users WHERE username = $1', ['bob_plays']);
    expect(after.total_spend).toBeCloseTo(before.total_spend + totalAmount, 2);
    const log = await ctx.db.one("SELECT * FROM transaction_log WHERE order_id = $1 AND type = 'purchase'", [orderId]);
    expect(log.amount).toBe(totalAmount);

    expect((await c.get('/api/cart')).json().items).toEqual([]);

    const orders = (await c.get('/api/orders')).json();
    expect(orders[0].orderId).toBe(orderId);
    const cyberpunk = orders[0].items.find((i) => i.gameId === 2);
    expect(cyberpunk.quantity).toBe(2);
    expect(cyberpunk.keys).toHaveLength(2);
  });

  it('defaults the payment method to QR', async () => {
    const c = client(ctx.app, await login(ctx.app, 'alice'));
    await c.post('/api/cart', { gameId: 3 });
    const res = await c.post('/api/checkout', {});
    expect(res.statusCode).toBe(201);
    const order = await ctx.db.one('SELECT payment_method FROM orders WHERE order_id = $1', [res.json().orderId]);
    expect(order.payment_method).toBe('QR');
  });

  it('rolls back when keys run out between adding to cart and paying', async () => {
    const c = client(ctx.app, await login(ctx.app, 'alice'));
    await c.post('/api/cart', { gameId: 5 });
    await ctx.db.query("UPDATE digital_keys SET status = 'reserved' WHERE game_id = 5");
    const ordersBefore = await ctx.db.one('SELECT COUNT(*)::int AS n FROM orders');

    const res = await c.post('/api/checkout', { paymentMethod: 'QR' });
    expect(res.statusCode).toBe(409);
    expect(res.json().message).toContain('Out of stock');
    const ordersAfter = await ctx.db.one('SELECT COUNT(*)::int AS n FROM orders');
    expect(ordersAfter.n).toBe(ordersBefore.n);
  });

  it('drops cart items whose game was deleted', async () => {
    const c = client(ctx.app, await login(ctx.app, 'bob'));
    await c.post('/api/cart', { gameId: 8 });
    await ctx.db.query('DELETE FROM digital_keys WHERE game_id = 8');
    await ctx.db.query('DELETE FROM games WHERE game_id = 8');
    expect((await c.get('/api/cart')).json().items).toEqual([]);
  });
});

describe('reviews and profile', () => {
  it('requires login to review', async () => {
    const res = await ctx.app.inject({ method: 'POST', url: '/api/games/1/reviews', payload: { rating: 5, comment: longText() } });
    expect(res.statusCode).toBe(401);
  });

  it('creates then updates a single review per user and game', async () => {
    const c = client(ctx.app, await login(ctx.app, 'bob'));
    const first = await c.post('/api/games/1/reviews', { rating: 3, comment: longText() });
    expect(first.statusCode).toBe(200);
    const second = await c.post('/api/games/1/reviews', { rating: 4, comment: longText(200) });
    expect(second.json().reviewId).toBe(first.json().reviewId);

    const game = (await c.get('/api/games/1')).json();
    expect(game.reviews.find((r) => r.username === 'bob_plays').rating).toBe(4);
  });

  it('validates the review', async () => {
    const c = client(ctx.app, await login(ctx.app, 'bob'));
    expect((await c.post('/api/games/1/reviews', { rating: 5, comment: 'too short' })).statusCode).toBe(400);
    expect((await c.post('/api/games/1/reviews', { rating: 9, comment: longText() })).statusCode).toBe(400);
    expect((await c.post('/api/games/9999/reviews', { rating: 5, comment: longText() })).statusCode).toBe(404);
  });

  it('shows and updates the profile username', async () => {
    const c = client(ctx.app, await login(ctx.app, 'alice'));
    expect((await c.get('/api/profile')).json()).toMatchObject({ username: 'alice_g', email: 'alice.gamer@gmail.com' });

    expect((await c.patch('/api/profile', { username: 'bob_plays' })).statusCode).toBe(409);
    expect((await c.patch('/api/profile', { username: 'ab' })).statusCode).toBe(400);
    expect((await c.patch('/api/profile', { username: 'has space' })).statusCode).toBe(400);

    const ok = await c.patch('/api/profile', { username: 'alice_new' });
    expect(ok.json().user.username).toBe('alice_new');
    expect((await c.get('/api/auth/me')).json().user.username).toBe('alice_new');
  });
});
