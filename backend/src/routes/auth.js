import bcrypt from 'bcryptjs';
import { badRequest, conflict, unauthorized } from '../lib/errors.js';
import { currentUser } from '../plugins/auth.js';

const sessionUser = (row) => ({ id: row.user_id, username: row.username, email: row.email, role: row.role });

export default async function authRoutes(app) {
  const { db } = app;

  app.get('/me', async (request) => ({ user: currentUser(request) }));

  app.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: { email: { type: 'string', minLength: 1 }, password: { type: 'string', minLength: 1 } },
      },
    },
  }, async (request) => {
    const login = request.body.email.trim();
    const user = await db.one(
      'SELECT * FROM users WHERE lower(email) = lower($1) OR username = $1',
      [login],
    );
    const ok = user && (await bcrypt.compare(request.body.password, user.password_hash));
    if (!ok) throw unauthorized('Invalid email or password. Please try again.');

    request.session.set('user', sessionUser(user));
    request.session.set('cart', []);
    return { user: sessionUser(user) };
  });

  app.post('/logout', async (request) => {
    request.session.delete();
    return { ok: true };
  });

  app.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'confirmPassword'],
        properties: {
          email: { type: 'string', format: 'email', maxLength: 150 },
          password: { type: 'string', minLength: 6, maxLength: 100 },
          confirmPassword: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const { password, confirmPassword } = request.body;
    const email = request.body.email.trim().toLowerCase();
    if (password !== confirmPassword) throw badRequest('Passwords do not match.');

    const existing = await db.one('SELECT 1 FROM users WHERE lower(email) = $1', [email]);
    if (existing) throw conflict('This email is already registered.');

    const username = await uniqueUsername(db, email.split('@')[0]);
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, hash],
    );
    reply.code(201);
    return { ok: true, username };
  });
}

/** The old app used the e-mail prefix as username and crashed on duplicates; add a number instead. */
export async function uniqueUsername(db, base) {
  const clean = base.replace(/[^A-Za-z0-9_]/g, '').slice(0, 20) || 'player';
  const taken = await db.query('SELECT username FROM users WHERE username LIKE $1', [`${clean}%`]);
  const names = new Set(taken.map((r) => r.username));
  if (!names.has(clean)) return clean;
  let n = 2;
  while (names.has(`${clean}${n}`)) n += 1;
  return `${clean}${n}`;
}
