import { orderStatusLabel, transactionStatusLabel } from '../../lib/format.js';
import { likePattern, parsePaging, toPage } from '../../lib/pagination.js';

const TRANSACTION_TYPES = ['deposit', 'withdrawal', 'purchase', 'refund'];

/** Read-only admin lists: users, orders, payments, reviews. */
export default async function listRoutes(app) {
  const { db } = app;

  app.get('/users', async (request) => {
    const paging = parsePaging(request.query);
    const rows = await db.query(
      `SELECT u.user_id, u.username, u.email, u.role, u.register_date, u.total_spend,
              (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.user_id)::int AS total_orders,
              COUNT(*) OVER () AS total_count
       FROM users u WHERE u.username ILIKE $1 OR u.email ILIKE $1
       ORDER BY u.user_id LIMIT $2 OFFSET $3`,
      [likePattern(request.query.search), paging.limit, paging.offset],
    );
    return toPage(rows, paging, (u) => ({
      userID: u.user_id,
      username: u.username,
      email: u.email,
      role: u.role,
      registerDate: u.register_date,
      totalOrders: u.total_orders,
      totalSpending: Number(u.total_spend),
    }));
  });

  app.get('/orders', async (request) => {
    const paging = parsePaging(request.query);
    const rows = await db.query(
      `SELECT o.order_id, o.total_amount, o.payment_method, o.payment_status, o.order_date, u.username,
              COALESCE(items.list, '[]') AS items,
              COUNT(*) OVER () AS total_count
       FROM orders o
       LEFT JOIN users u ON u.user_id = o.user_id
       LEFT JOIN LATERAL (
         SELECT json_agg(json_build_object('productName', g.title, 'price', oi.purchase_price, 'keyCode', dk.key_code)
                         ORDER BY oi.order_item_id) AS list,
                string_agg(g.title, ' ') AS names
         FROM order_items oi
         JOIN digital_keys dk ON dk.digital_key_id = oi.digital_key_id
         JOIN games g ON g.game_id = dk.game_id
         WHERE oi.order_id = o.order_id
       ) items ON TRUE
       WHERE o.order_id::text ILIKE $1 OR u.username ILIKE $1 OR COALESCE(items.names, '') ILIKE $1
       ORDER BY o.order_id LIMIT $2 OFFSET $3`,
      [likePattern(request.query.search), paging.limit, paging.offset],
    );
    return toPage(rows, paging, (o) => ({
      orderID: o.order_id,
      username: o.username ?? '(deleted user)',
      items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
      totalAmount: Number(o.total_amount),
      paymentMethod: o.payment_method,
      status: orderStatusLabel(o.payment_status),
      orderDate: o.order_date,
    }));
  });

  app.get('/payments', async (request) => {
    const paging = parsePaging(request.query);
    const type = TRANSACTION_TYPES.includes(request.query.type) ? request.query.type : null;
    const rows = await db.query(
      `SELECT t.transaction_id, t.order_id, t.type, t.amount, t.created_at, u.username,
              COUNT(*) OVER () AS total_count
       FROM transaction_log t LEFT JOIN users u ON u.user_id = t.user_id
       WHERE ($1::transaction_type IS NULL OR t.type = $1)
         AND (t.transaction_id::text ILIKE $2 OR COALESCE(t.order_id::text, '') ILIKE $2
              OR u.username ILIKE $2 OR t.type::text ILIKE $2)
       ORDER BY t.transaction_id LIMIT $3 OFFSET $4`,
      [type, likePattern(request.query.search), paging.limit, paging.offset],
    );
    return toPage(rows, paging, (t) => ({
      id: t.transaction_id,
      orderID: t.order_id,
      username: t.username,
      amount: Number(t.amount),
      type: t.type,
      status: transactionStatusLabel(t.type),
      date: t.created_at,
    }));
  });

  app.get('/reviews', async (request) => {
    const paging = parsePaging(request.query);
    const rows = await db.query(
      `SELECT r.game_review_id, r.rating, r.comment, r.review_date, u.username, g.title,
              COUNT(*) OVER () AS total_count
       FROM game_reviews r
       JOIN users u ON u.user_id = r.user_id
       JOIN games g ON g.game_id = r.game_id
       WHERE u.username ILIKE $1 OR g.title ILIKE $1 OR COALESCE(r.comment, '') ILIKE $1
       ORDER BY r.game_review_id LIMIT $2 OFFSET $3`,
      [likePattern(request.query.search), paging.limit, paging.offset],
    );
    return toPage(rows, paging, (r) => ({
      reviewID: r.game_review_id,
      username: r.username,
      productName: r.title,
      rating: r.rating,
      comment: r.comment,
      date: r.review_date,
    }));
  });
}
