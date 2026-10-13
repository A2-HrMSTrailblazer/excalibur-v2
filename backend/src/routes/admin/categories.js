import { conflict, isUniqueViolation, notFound } from '../../lib/errors.js';
import { likePattern, parsePaging, toPage } from '../../lib/pagination.js';

const body = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    icon: { type: 'string', maxLength: 100 },
  },
};
const idParams = { type: 'object', properties: { id: { type: 'integer' } } };

export default async function categoryRoutes(app) {
  const { db } = app;

  const save = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      if (isUniqueViolation(err)) throw conflict('A category with this name already exists.');
      throw err;
    }
  };

  app.get('/', async (request) => {
    const paging = parsePaging(request.query);
    const rows = await db.query(
      `SELECT c.*, (SELECT COUNT(*) FROM games g WHERE g.category_id = c.category_id)::int AS game_count,
              COUNT(*) OVER () AS total_count
       FROM categories c WHERE c.name ILIKE $1 ORDER BY c.name LIMIT $2 OFFSET $3`,
      [likePattern(request.query.search), paging.limit, paging.offset],
    );
    return toPage(rows, paging, (c) => ({ id: c.category_id, name: c.name, icon: c.icon, gameCount: c.game_count }));
  });

  app.post('/', { schema: { body } }, async (request, reply) => {
    const { name, icon } = request.body;
    const row = await save(() => db.one(
      'INSERT INTO categories (name, icon) VALUES ($1, $2) RETURNING category_id',
      [name.trim(), icon?.trim() || 'Steam-Logo'],
    ));
    reply.code(201);
    return { id: row.category_id };
  });

  app.put('/:id', { schema: { body, params: idParams } }, async (request) => {
    const { name, icon } = request.body;
    const row = await save(() => db.one(
      'UPDATE categories SET name = $1, icon = $2 WHERE category_id = $3 RETURNING category_id',
      [name.trim(), icon?.trim() || 'Steam-Logo', request.params.id],
    ));
    if (!row) throw notFound('Category not found.');
    return { ok: true };
  });

  // Games in a deleted category keep existing with no platform (FK is ON DELETE SET NULL).
  app.delete('/:id', { schema: { params: idParams } }, async (request) => {
    const row = await db.one('DELETE FROM categories WHERE category_id = $1 RETURNING category_id', [request.params.id]);
    if (!row) throw notFound('Category not found.');
    return { ok: true };
  });
}
