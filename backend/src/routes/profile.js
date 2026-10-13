import { conflict, isUniqueViolation } from '../lib/errors.js';
import { currentUser, requireUser } from '../plugins/auth.js';

export default async function profileRoutes(app) {
  const { db } = app;
  app.addHook('preHandler', requireUser);

  app.get('/', async (request) => {
    const row = await db.one(
      'SELECT user_id, username, email, total_spend, register_date FROM users WHERE user_id = $1',
      [currentUser(request).id],
    );
    return {
      id: row.user_id,
      username: row.username,
      email: row.email,
      totalSpend: Number(row.total_spend),
      registerDate: row.register_date,
    };
  });

  app.patch('/', {
    schema: {
      body: {
        type: 'object',
        required: ['username'],
        properties: { username: { type: 'string', pattern: '^[A-Za-z0-9_]{6,20}$' } },
      },
    },
  }, async (request) => {
    const user = currentUser(request);
    const { username } = request.body;
    try {
      await db.query('UPDATE users SET username = $1 WHERE user_id = $2', [username, user.id]);
    } catch (err) {
      if (isUniqueViolation(err)) throw conflict('Username already taken.');
      throw err;
    }
    const updated = { ...user, username };
    request.session.set('user', updated);
    return { user: updated };
  });
}
