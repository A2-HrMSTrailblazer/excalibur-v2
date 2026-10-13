import { notFound } from '../lib/errors.js';
import { parseOptionalNumber, toCard, toList } from '../lib/format.js';

const STORE_PAGE_SIZE = 15;

export default async function catalogRoutes(app) {
  const { db } = app;

  app.get('/categories', async () => {
    const rows = await db.query('SELECT category_id, name, icon FROM categories ORDER BY name ASC');
    return rows.map((c) => ({ id: c.category_id, name: c.name, icon: c.icon }));
  });

  app.get('/home', async () => {
    const [nintendo, topGames, recommended] = await Promise.all([
      db.query("SELECT * FROM game_catalog WHERE platform_name = 'Nintendo' ORDER BY game_id DESC LIMIT 5"),
      db.query('SELECT * FROM game_catalog ORDER BY price DESC, game_id LIMIT 5'),
      db.query('SELECT * FROM game_catalog ORDER BY random() LIMIT 5'),
    ]);
    return {
      nintendo: nintendo.map(toCard),
      topGames: topGames.map(toCard),
      recommended: recommended.map(toCard),
    };
  });

  app.get('/games', async (request) => {
    const { search, minPrice, maxPrice } = request.query;
    const platforms = toList(request.query.platform);
    const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1);

    const where = [];
    const params = [];
    if (search && String(search).trim()) {
      params.push(`%${String(search).trim()}%`);
      where.push(`title ILIKE $${params.length}`);
    }
    if (platforms.length > 0) {
      params.push(platforms);
      where.push(`platform_name = ANY($${params.length})`);
    }
    const min = parseOptionalNumber(minPrice);
    if (min !== null) {
      params.push(min);
      where.push(`price >= $${params.length}`);
    }
    const max = parseOptionalNumber(maxPrice);
    if (max !== null) {
      params.push(max);
      where.push(`price <= $${params.length}`);
    }
    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    params.push(STORE_PAGE_SIZE, (page - 1) * STORE_PAGE_SIZE);
    const rows = await db.query(
      `SELECT *, COUNT(*) OVER () AS total_count FROM game_catalog ${whereSql}
       ORDER BY game_id LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
    return {
      items: rows.map(toCard),
      page,
      totalPages: Math.max(1, Math.ceil(total / STORE_PAGE_SIZE)),
      total,
    };
  });

  app.get('/games/random', async (request) => {
    const limit = Math.min(20, Math.max(1, Number.parseInt(request.query.limit, 10) || 5));
    const exclude = Number.parseInt(request.query.exclude, 10) || 0;
    const rows = await db.query(
      'SELECT * FROM game_catalog WHERE game_id <> $1 ORDER BY random() LIMIT $2',
      [exclude, limit],
    );
    return rows.map(toCard);
  });

  app.get('/games/:id', {
    schema: { params: { type: 'object', properties: { id: { type: 'integer' } } } },
  }, async (request) => {
    const { id } = request.params;
    const game = await db.one('SELECT * FROM game_catalog WHERE game_id = $1', [id]);
    if (!game) throw notFound('Game not found.');

    const [prices, reviews] = await Promise.all([
      db.query(
        'SELECT price, recorded_date FROM price_history WHERE game_id = $1 ORDER BY recorded_date ASC, price_history_id ASC',
        [id],
      ),
      db.query(
        `SELECT r.game_review_id, r.rating, r.comment, r.review_date, u.username
         FROM game_reviews r JOIN users u ON u.user_id = r.user_id
         WHERE r.game_id = $1 ORDER BY r.review_date DESC`,
        [id],
      ),
    ]);

    return {
      ...toCard(game),
      description: game.description || 'No description available.',
      releaseDate: game.release_date,
      avgRating: Number(game.avg_rating),
      priceHistory: prices.map((p) => ({ price: Number(p.price), date: p.recorded_date })),
      reviews: reviews.map((r) => ({
        id: r.game_review_id,
        username: r.username,
        rating: r.rating,
        comment: r.comment,
        date: r.review_date,
      })),
    };
  });
}
