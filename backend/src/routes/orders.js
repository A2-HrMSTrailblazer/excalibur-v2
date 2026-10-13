import { imageUrl, roundMoney } from '../lib/format.js';
import { currentUser, requireUser } from '../plugins/auth.js';

/** Groups flat order rows (one per key) into orders -> games -> keys, like the old OrderController. */
export function groupOrders(rows) {
  const orders = new Map();
  for (const row of rows) {
    if (!orders.has(row.order_id)) {
      orders.set(row.order_id, { orderId: row.order_id, orderDate: row.order_date, total: 0, items: new Map() });
    }
    const order = orders.get(row.order_id);
    if (!order.items.has(row.game_id)) {
      order.items.set(row.game_id, {
        gameId: row.game_id,
        name: row.title,
        image: imageUrl(row.img),
        platformName: row.platform_name,
        price: Number(row.purchase_price),
        keys: [],
        quantity: 0,
      });
    }
    const item = order.items.get(row.game_id);
    item.keys.push(row.key_code);
    item.quantity += 1;
    order.total += Number(row.purchase_price);
  }
  return [...orders.values()].map((o) => ({ ...o, total: roundMoney(o.total), items: [...o.items.values()] }));
}

export default async function orderRoutes(app) {
  const { db } = app;
  app.addHook('preHandler', requireUser);

  app.get('/', async (request) => {
    const rows = await db.query(
      `SELECT o.order_id, o.order_date, oi.purchase_price, dk.key_code,
              g.game_id, g.title, g.img, c.name AS platform_name
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.order_id
       JOIN digital_keys dk ON dk.digital_key_id = oi.digital_key_id
       JOIN games g ON g.game_id = dk.game_id
       LEFT JOIN categories c ON c.category_id = g.category_id
       WHERE o.user_id = $1
       ORDER BY o.order_date DESC, o.order_id DESC, oi.order_item_id`,
      [currentUser(request).id],
    );
    return groupOrders(rows);
  });
}
