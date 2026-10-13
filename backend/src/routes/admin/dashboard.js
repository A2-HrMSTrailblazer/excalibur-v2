import { roundMoney } from '../../lib/format.js';

export default async function dashboardRoutes(app) {
  const { db } = app;

  app.get('/dashboard', async () => {
    const [stats, sales, top] = await Promise.all([
      db.one(`SELECT
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status NOT IN ('refunded', 'failed')) AS revenue,
          (SELECT COUNT(*) FROM orders)::int AS orders,
          (SELECT COUNT(*) FROM games)::int AS products,
          (SELECT COUNT(*) FROM users WHERE role = 'customer')::int AS users,
          (SELECT COUNT(*) FROM digital_keys WHERE status = 'available')::int AS keys`),
      // Last 6 months up to the most recent order (same window as the old MySQL query).
      db.query(`WITH ref AS (
          SELECT date_trunc('month', COALESCE(MAX(order_date), NOW())) AS m FROM orders
        ), months AS (
          SELECT generate_series((SELECT m FROM ref) - INTERVAL '5 months', (SELECT m FROM ref), INTERVAL '1 month') AS m
        )
        SELECT to_char(months.m, 'Mon YYYY') AS label,
               COALESCE(SUM(o.total_amount) FILTER (WHERE o.payment_status NOT IN ('refunded', 'failed')), 0) AS value
        FROM months
        LEFT JOIN orders o ON date_trunc('month', o.order_date) = months.m
        GROUP BY months.m ORDER BY months.m`),
      db.query(`SELECT g.title AS name, COUNT(oi.order_item_id)::int AS count
        FROM games g
        JOIN digital_keys dk ON dk.game_id = g.game_id
        JOIN order_items oi ON oi.digital_key_id = dk.digital_key_id
        GROUP BY g.game_id ORDER BY count DESC, g.title LIMIT 10`),
    ]);

    const maxCount = top.length > 0 ? top[0].count : 1;
    return {
      stats: { ...stats, revenue: roundMoney(stats.revenue) },
      salesData: { labels: sales.map((s) => s.label), values: sales.map((s) => Number(s.value)) },
      topSelling: top.map((t) => ({ ...t, percentage: Math.round((t.count / maxCount) * 100) })),
    };
  });
}
