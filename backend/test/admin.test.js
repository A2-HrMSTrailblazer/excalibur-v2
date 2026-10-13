import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { client, login, multipartBody, setupApp } from './helpers.js';

let ctx;
let admin;
beforeAll(async () => {
  ctx = await setupApp();
  admin = client(ctx.app, await login(ctx.app, 'admin'));
});
afterAll(async () => { await ctx.close(); });

describe('admin access', () => {
  it('blocks guests (401) and customers (403)', async () => {
    expect((await ctx.app.inject({ url: '/api/admin/dashboard' })).statusCode).toBe(401);
    const customer = client(ctx.app, await login(ctx.app, 'alice'));
    expect((await customer.get('/api/admin/dashboard')).statusCode).toBe(403);
  });
});

describe('dashboard', () => {
  it('returns stats, 6 months of sales and top sellers', async () => {
    const data = (await admin.get('/api/admin/dashboard')).json();
    expect(data.stats).toMatchObject({ orders: 5, products: 114, users: 2, keys: 561 });
    // Seed revenue without the refunded order: 89.98 + 49.98 + 29.99 + 44.98
    expect(data.stats.revenue).toBe(214.93);
    expect(data.salesData.labels).toEqual(['Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024']);
    expect(data.salesData.values.at(-2)).toBeCloseTo(214.93, 2);
    expect(data.topSelling[0].percentage).toBe(100);
  });
});

describe('products', () => {
  it('lists, searches and pages products', async () => {
    const page = (await admin.get('/api/admin/products?page=2')).json();
    expect(page).toMatchObject({ page: 2, totalItems: 114, totalPages: 12 });
    expect(page.items).toHaveLength(10);
    const search = (await admin.get('/api/admin/products?search=hades')).json();
    expect(search.items[0]).toMatchObject({ name: 'Hades', categoryName: 'Epic Games' });
    const options = (await admin.get('/api/admin/products/options')).json();
    expect(options).toHaveLength(114);
  });

  it('adds a product with an image and price history', async () => {
    const { payload, headers } = multipartBody(
      { title: 'Test Quest', price: '12.50', release_date: '2025-05-01', description: 'A test game', category_id: '1' },
      { filename: 'cover.png' },
    );
    const res = await admin.post('/api/admin/products', payload, headers);
    expect(res.statusCode).toBe(201);
    const { id } = res.json();

    const game = await ctx.db.one('SELECT * FROM games WHERE game_id = $1', [id]);
    expect(game.img).toMatch(/^test-quest-\d+\.png$/);
    expect(fs.existsSync(path.join(ctx.uploadDir, game.img))).toBe(true);
    const detail = (await admin.get(`/api/games/${id}`)).json();
    expect(detail.price).toBe(12.5);

    const served = await ctx.app.inject({ url: `/uploads/${game.img}` });
    expect(served.statusCode).toBe(200);
  });

  it('adds a product without an image and ignores other file fields', async () => {
    const { payload, headers } = multipartBody({ title: 'No Image', price: '5' }, { field: 'other', filename: 'x.png' });
    const res = await admin.post('/api/admin/products', payload, headers);
    expect(res.statusCode).toBe(201);
    const game = await ctx.db.one('SELECT img, category_id FROM games WHERE game_id = $1', [res.json().id]);
    expect(game).toEqual({ img: null, category_id: null });
  });

  it('rejects invalid product forms and non-image uploads', async () => {
    const bad = multipartBody({ title: '', price: '5' });
    expect((await admin.post('/api/admin/products', bad.payload, bad.headers)).statusCode).toBe(400);
    const exe = multipartBody({ title: 'Virus', price: '5' }, { filename: 'virus.exe', type: 'application/octet-stream' });
    const res = await admin.post('/api/admin/products', exe.payload, exe.headers);
    expect(res.statusCode).toBe(400);
    expect(res.json().message).toContain('Image must be');
  });

  it('edits a product, keeping the old image and adding a price row only when the price changes', async () => {
    const countPrices = async () => (await ctx.db.one('SELECT COUNT(*)::int AS n FROM price_history WHERE game_id = 2')).n;
    const before = await countPrices();
    const oldImg = (await ctx.db.one('SELECT img FROM games WHERE game_id = 2')).img;

    const same = multipartBody({ title: 'Cyberpunk 2077', price: '15.99', category_id: '1', release_date: '2020-12-10' });
    expect((await admin.put('/api/admin/products/2', same.payload, same.headers)).statusCode).toBe(200);
    expect(await countPrices()).toBe(before);

    const changed = multipartBody({ title: 'Cyberpunk 2077 Ultimate', price: '39.99', category_id: '1' });
    expect((await admin.put('/api/admin/products/2', changed.payload, changed.headers)).statusCode).toBe(200);
    expect(await countPrices()).toBe(before + 1);
    const game = await ctx.db.one('SELECT title, img FROM games WHERE game_id = 2');
    expect(game).toEqual({ title: 'Cyberpunk 2077 Ultimate', img: oldImg });

    const withImage = multipartBody({ title: 'Cyberpunk 2077', price: '39.99', category_id: '1' }, { filename: 'new.jpg', type: 'image/jpeg' });
    await admin.put('/api/admin/products/2', withImage.payload, withImage.headers);
    expect((await ctx.db.one('SELECT img FROM games WHERE game_id = 2')).img).toMatch(/^cyberpunk-2077-\d+\.jpg$/);

    const missing = multipartBody({ title: 'X', price: '1' });
    expect((await admin.put('/api/admin/products/99999', missing.payload, missing.headers)).statusCode).toBe(404);
  });

  it('deletes an unsold product but refuses one with sales', async () => {
    expect((await admin.delete('/api/admin/products/1')).statusCode).toBe(409);
    expect((await admin.delete('/api/admin/products/9')).statusCode).toBe(200);
    expect(await ctx.db.one('SELECT 1 FROM games WHERE game_id = 9')).toBeNull();
    expect((await admin.delete('/api/admin/products/9')).statusCode).toBe(404);
  });
});

describe('categories', () => {
  it('lists with game counts and searches', async () => {
    const page = (await admin.get('/api/admin/categories')).json();
    expect(page.totalItems).toBe(10);
    const steam = (await admin.get('/api/admin/categories?search=steam')).json().items[0];
    expect(steam.gameCount).toBeGreaterThan(20);
  });

  it('adds, edits and deletes a category', async () => {
    const created = await admin.post('/api/admin/categories', { name: 'GOG' });
    expect(created.statusCode).toBe(201);
    const { id } = created.json();
    expect((await ctx.db.one('SELECT icon FROM categories WHERE category_id = $1', [id])).icon).toBe('Steam-Logo');

    expect((await admin.post('/api/admin/categories', { name: 'GOG' })).statusCode).toBe(409);
    expect((await admin.put(`/api/admin/categories/${id}`, { name: 'GOG Galaxy', icon: 'GOG-Logo' })).statusCode).toBe(200);
    expect((await admin.put(`/api/admin/categories/${id}`, { name: 'Steam' })).statusCode).toBe(409);
    expect((await admin.put('/api/admin/categories/9999', { name: 'Nope' })).statusCode).toBe(404);
    expect((await admin.post('/api/admin/categories', {})).statusCode).toBe(400);

    expect((await admin.delete(`/api/admin/categories/${id}`)).statusCode).toBe(200);
    expect((await admin.delete(`/api/admin/categories/${id}`)).statusCode).toBe(404);
  });

  it('keeps games when their category is deleted', async () => {
    expect((await admin.delete('/api/admin/categories/9')).statusCode).toBe(200);
    const orphan = await ctx.db.one('SELECT category_id FROM games WHERE game_id = 95');
    expect(orphan.category_id).toBeNull();
  });
});

describe('game keys', () => {
  it('lists and searches keys', async () => {
    const page = (await admin.get('/api/admin/keys?search=G001')).json();
    expect(page.totalItems).toBe(5);
    expect(page.items[0]).toMatchObject({ code: 'G001-K001', status: 'sold', productName: 'Elden Ring' });
  });

  it('adds a key, rejects duplicates and unknown games', async () => {
    expect((await admin.post('/api/admin/keys', { key_code: 'NEW-KEY-1', game_id: 3 })).statusCode).toBe(201);
    expect((await admin.post('/api/admin/keys', { key_code: 'NEW-KEY-1', game_id: 3 })).statusCode).toBe(409);
    expect((await admin.post('/api/admin/keys', { key_code: 'NEW-KEY-2', game_id: 99999 })).statusCode).toBe(404);
  });

  it('deletes available keys only', async () => {
    const sold = await ctx.db.one("SELECT digital_key_id FROM digital_keys WHERE status = 'sold' LIMIT 1");
    expect((await admin.delete(`/api/admin/keys/${sold.digital_key_id}`)).statusCode).toBe(409);
    const free = await ctx.db.one("SELECT digital_key_id FROM digital_keys WHERE key_code = 'NEW-KEY-1'");
    expect((await admin.delete(`/api/admin/keys/${free.digital_key_id}`)).statusCode).toBe(200);
    expect((await admin.delete(`/api/admin/keys/${free.digital_key_id}`)).statusCode).toBe(404);
  });
});

describe('read-only lists', () => {
  it('lists users with order counts', async () => {
    const page = (await admin.get('/api/admin/users?search=alice')).json();
    expect(page.items[0]).toMatchObject({ username: 'alice_g', totalOrders: 3, totalSpending: 350 });
  });

  it('lists orders with their items and searches by product', async () => {
    const all = (await admin.get('/api/admin/orders')).json();
    expect(all.totalItems).toBe(5);
    expect(all.items[0]).toMatchObject({ orderID: 1, username: 'alice_g', status: 'Completed', paymentMethod: 'QR' });
    expect(all.items[0].items).toHaveLength(2);
    expect(all.items[2].status).toBe('Refunded');

    const byProduct = (await admin.get('/api/admin/orders?search=Hades')).json();
    expect(byProduct.items.map((o) => o.orderID)).toEqual([1]);
  });

  it('lists payments and filters by type', async () => {
    expect((await admin.get('/api/admin/payments')).json().totalItems).toBe(9);
    const refunds = (await admin.get('/api/admin/payments?type=refund')).json();
    expect(refunds.items).toHaveLength(1);
    expect(refunds.items[0]).toMatchObject({ status: 'Refunded', amount: 59.99 });
    const deposits = (await admin.get('/api/admin/payments?type=deposit')).json();
    expect(deposits.items.every((p) => p.orderID === null && p.status === 'Completed')).toBe(true);
    expect((await admin.get('/api/admin/payments?type=bogus')).json().totalItems).toBe(9);
  });

  it('lists and searches reviews', async () => {
    expect((await admin.get('/api/admin/reviews')).json().totalItems).toBe(9);
    const search = (await admin.get('/api/admin/reviews?search=Witcher')).json();
    expect(search.items).toHaveLength(1);
  });
});
