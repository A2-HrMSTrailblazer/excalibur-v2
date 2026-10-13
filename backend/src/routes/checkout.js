import { badRequest, conflict } from '../lib/errors.js';
import { roundMoney } from '../lib/format.js';
import { currentUser, requireUser } from '../plugins/auth.js';
import { getCart, loadCart } from './cart.js';

export const PAYMENT_METHODS = [
  { id: 'QR', name: 'QR PromptPay', logo: '/asset/client/login/PromptPay-Logo.png' },
  { id: 'TRUEMONEY', name: 'TrueMoney Wallet', logo: '/asset/client/login/Truemoneywallet-Logo.png' },
];

export default async function checkoutRoutes(app) {
  const { db } = app;
  app.addHook('preHandler', requireUser);

  app.get('/payment-methods', async () => PAYMENT_METHODS);

  app.post('/', {
    schema: {
      body: {
        type: 'object',
        properties: { paymentMethod: { type: 'string', enum: PAYMENT_METHODS.map((m) => m.id), default: 'QR' } },
      },
    },
  }, async (request, reply) => {
    const userId = currentUser(request).id;
    const cart = await loadCart(db, getCart(request));
    if (cart.items.length === 0) throw badRequest('Your cart is empty.');

    const paymentMethod = request.body?.paymentMethod ?? 'QR';
    const totalAmount = roundMoney(cart.totalPrice);

    const orderId = await db.tx(async (tx) => {
      const order = await tx.one(
        'INSERT INTO orders (user_id, total_amount, payment_method) VALUES ($1, $2, $3) RETURNING order_id',
        [userId, totalAmount, paymentMethod],
      );

      for (const item of cart.items) {
        // SKIP LOCKED: two customers checking out at once never get the same key.
        const keys = await tx.query(
          `SELECT digital_key_id FROM digital_keys
           WHERE game_id = $1 AND status = 'available'
           ORDER BY digital_key_id LIMIT $2 FOR UPDATE SKIP LOCKED`,
          [item.gameId, item.quantity],
        );
        if (keys.length < item.quantity) throw conflict(`Out of stock for game: ${item.name}`);

        for (const key of keys) {
          const orderItem = await tx.one(
            'INSERT INTO order_items (digital_key_id, order_id, purchase_price) VALUES ($1, $2, $3) RETURNING order_item_id',
            [key.digital_key_id, order.order_id, item.price],
          );
          await tx.query(
            "UPDATE digital_keys SET status = 'sold', order_item_id = $1, sold_date = NOW() WHERE digital_key_id = $2",
            [orderItem.order_item_id, key.digital_key_id],
          );
        }
      }

      await tx.query(
        "INSERT INTO transaction_log (order_id, user_id, type, amount) VALUES ($1, $2, 'purchase', $3)",
        [order.order_id, userId, totalAmount],
      );
      await tx.query('UPDATE users SET total_spend = total_spend + $1 WHERE user_id = $2', [totalAmount, userId]);
      return order.order_id;
    });

    request.session.set('cart', []);
    reply.code(201);
    return { orderId, totalAmount };
  });
}
