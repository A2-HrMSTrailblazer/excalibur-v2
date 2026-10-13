import { notFound } from '../lib/errors.js';
import { currentUser, requireUser } from '../plugins/auth.js';

export const MIN_REVIEW_LENGTH = 150;

export default async function reviewRoutes(app) {
  const { db } = app;

  app.post('/games/:id/reviews', {
    preHandler: requireUser,
    schema: {
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: {
        type: 'object',
        required: ['rating', 'comment'],
        properties: {
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string', minLength: MIN_REVIEW_LENGTH, maxLength: 5000 },
        },
      },
    },
  }, async (request) => {
    const gameId = request.params.id;
    const game = await db.one('SELECT 1 FROM games WHERE game_id = $1', [gameId]);
    if (!game) throw notFound('Game not found.');

    // One review per user per game: writing again updates the old review (same as SE262).
    const review = await db.one(
      `INSERT INTO game_reviews (game_id, user_id, rating, comment, review_date)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, game_id)
       DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, review_date = NOW()
       RETURNING game_review_id`,
      [gameId, currentUser(request).id, request.body.rating, request.body.comment.trim()],
    );
    return { ok: true, reviewId: review.game_review_id };
  });
}
