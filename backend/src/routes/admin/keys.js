import { conflict, isUniqueViolation, notFound } from '../../lib/errors.js';
import { likePattern, parsePaging, toPage } from '../../lib/pagination.js';

export default async function keyRoutes(app) {
  const { db } = app;

  app.get('/', async (request) => {
    const paging = parsePaging(request.query);
    const rows = await db.query(
      `SELECT dk.digital_key_id, dk.key_code, dk.status, dk.sold_date, g.title, c.name AS category_name,
              COUNT(*) OVER () AS total_count
       FROM digital_keys dk
       JOIN games g ON g.game_id = dk.game_id
       LEFT JOIN categories c ON c.category_id = g.category_id
       WHERE dk.key_code ILIKE $1 OR g.title ILIKE $1 OR c.name ILIKE $1
       ORDER BY dk.digital_key_id LIMIT $2 OFFSET $3`,
      [likePattern(request.query.search), paging.limit, paging.offset],
    );
    return toPage(rows, paging, (k) => ({
      id: k.digital_key_id,
      code: k.key_code,
      productName: k.title,
      category: k.category_name,
      status: k.status,
      date: k.sold_date,
    }));
  });

  app.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['key_code', 'game_id'],
        properties: {
          key_code: { type: 'string', minLength: 1, maxLength: 100 },
          game_id: { type: 'integer' },
        },
      },
    },
  }, async (request, reply) => {
    const { key_code: code, game_id: gameId } = request.body;
    const game = await db.one('SELECT 1 FROM games WHERE game_id = $1', [gameId]);
    if (!game) throw notFound('Product not found.');
    try {
      const row = await db.one(
        'INSERT INTO digital_keys (key_code, game_id) VALUES ($1, $2) RETURNING digital_key_id',
        [code.trim(), gameId],
      );
      reply.code(201);
      return { id: row.digital_key_id };
    } catch (err) {
      if (isUniqueViolation(err)) throw conflict('This key code already exists.');
      throw err;
    }
  });

  app.delete('/:id', {
    schema: { params: { type: 'object', properties: { id: { type: 'integer' } } } },
  }, async (request) => {
    const key = await db.one('SELECT status FROM digital_keys WHERE digital_key_id = $1', [request.params.id]);
    if (!key) throw notFound('Key not found.');
    if (key.status === 'sold') throw conflict('Cannot delete a key that has already been sold.');
    await db.query('DELETE FROM digital_keys WHERE digital_key_id = $1', [request.params.id]);
    return { ok: true };
  });
}
