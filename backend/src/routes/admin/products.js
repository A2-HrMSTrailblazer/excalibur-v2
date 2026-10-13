import { conflict, notFound } from '../../lib/errors.js';
import { imageUrl } from '../../lib/format.js';
import { likePattern, parsePaging, toPage } from '../../lib/pagination.js';
import { readProductForm } from '../../lib/upload.js';
import { parseProductFields } from '../../lib/validate.js';

const idParams = { type: 'object', properties: { id: { type: 'integer' } } };

const toAdminProduct = (g) => ({
  id: g.game_id,
  name: g.title,
  price: Number(g.price),
  releaseDate: g.release_date,
  description: g.description,
  rating: Number(g.avg_rating),
  image: g.img,
  imageUrl: imageUrl(g.img),
  categoryId: g.category_id,
  categoryName: g.platform_name,
  stock: g.stock,
});

export default async function productRoutes(app) {
  const { db, config } = app;

  app.get('/', async (request) => {
    const paging = parsePaging(request.query);
    const rows = await db.query(
      `SELECT *, COUNT(*) OVER () AS total_count FROM game_catalog
       WHERE title ILIKE $1 ORDER BY game_id LIMIT $2 OFFSET $3`,
      [likePattern(request.query.search), paging.limit, paging.offset],
    );
    return toPage(rows, paging, toAdminProduct);
  });

  app.get('/options', async () => {
    const rows = await db.query('SELECT game_id, title FROM games ORDER BY title');
    return rows.map((r) => ({ id: r.game_id, title: r.title }));
  });

  app.post('/', async (request, reply) => {
    const { fields, filename } = await readProductForm(request, config.uploadDir);
    const p = parseProductFields(fields);
    const game = await db.tx(async (tx) => {
      const row = await tx.one(
        `INSERT INTO games (title, img, release_date, description, category_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING game_id`,
        [p.title, filename, p.releaseDate, p.description, p.categoryId],
      );
      await tx.query('INSERT INTO price_history (game_id, price) VALUES ($1, $2)', [row.game_id, p.price]);
      return row;
    });
    reply.code(201);
    return { id: game.game_id };
  });

  app.put('/:id', { schema: { params: idParams } }, async (request) => {
    const { id } = request.params;
    const { fields, filename } = await readProductForm(request, config.uploadDir);
    const p = parseProductFields(fields);

    await db.tx(async (tx) => {
      const existing = await tx.one('SELECT img FROM games WHERE game_id = $1 FOR UPDATE', [id]);
      if (!existing) throw notFound('Product not found.');
      await tx.query(
        `UPDATE games SET title = $1, release_date = $2, description = $3, img = $4, category_id = $5
         WHERE game_id = $6`,
        [p.title, p.releaseDate, p.description, filename ?? existing.img, p.categoryId, id],
      );
      // A price change is stored as a new price_history row so the price chart keeps its history.
      const current = await tx.one(
        'SELECT price FROM price_history WHERE game_id = $1 ORDER BY recorded_date DESC, price_history_id DESC LIMIT 1',
        [id],
      );
      if (!current || Number(current.price) !== p.price) {
        await tx.query('INSERT INTO price_history (game_id, price) VALUES ($1, $2)', [id, p.price]);
      }
    });
    return { ok: true };
  });

  app.delete('/:id', { schema: { params: idParams } }, async (request) => {
    const { id } = request.params;
    await db.tx(async (tx) => {
      const game = await tx.one('SELECT game_id FROM games WHERE game_id = $1 FOR UPDATE', [id]);
      if (!game) throw notFound('Product not found.');
      const sold = await tx.one("SELECT COUNT(*)::int AS n FROM digital_keys WHERE game_id = $1 AND status <> 'available'", [id]);
      if (sold.n > 0) throw conflict('This product has sold keys, so it cannot be deleted.');
      await tx.query('DELETE FROM digital_keys WHERE game_id = $1', [id]);
      await tx.query('DELETE FROM game_reviews WHERE game_id = $1', [id]);
      await tx.query('DELETE FROM games WHERE game_id = $1', [id]);
    });
    return { ok: true };
  });
}
