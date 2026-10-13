import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { client, login, setupApp, USERS } from './helpers.js';

let ctx;
beforeAll(async () => { ctx = await setupApp(); });
afterAll(async () => { await ctx.close(); });

describe('auth', () => {
  it('reports no user when logged out', async () => {
    const res = await ctx.app.inject({ url: '/api/auth/me' });
    expect(res.json()).toEqual({ user: null });
  });

  it('logs in a seeded customer by email or username', async () => {
    const byEmail = await ctx.app.inject({ method: 'POST', url: '/api/auth/login', payload: USERS.alice });
    expect(byEmail.statusCode).toBe(200);
    expect(byEmail.json().user).toMatchObject({ username: 'alice_g', role: 'customer' });

    const byName = await ctx.app.inject({ method: 'POST', url: '/api/auth/login', payload: { email: 'bob_plays', password: USERS.bob.password } });
    expect(byName.statusCode).toBe(200);
  });

  it('rejects a wrong password and unknown users', async () => {
    const wrong = await ctx.app.inject({ method: 'POST', url: '/api/auth/login', payload: { ...USERS.alice, password: 'nope' } });
    expect(wrong.statusCode).toBe(401);
    const unknown = await ctx.app.inject({ method: 'POST', url: '/api/auth/login', payload: { email: 'ghost@x.com', password: 'x' } });
    expect(unknown.statusCode).toBe(401);
  });

  it('validates the login body', async () => {
    const res = await ctx.app.inject({ method: 'POST', url: '/api/auth/login', payload: { email: 'a' } });
    expect(res.statusCode).toBe(400);
  });

  it('keeps the session across requests and logs out', async () => {
    const c = client(ctx.app, await login(ctx.app, 'admin'));
    expect((await c.get('/api/auth/me')).json().user.role).toBe('admin');
    expect((await c.post('/api/auth/logout')).statusCode).toBe(200);
    expect((await c.get('/api/auth/me')).json().user).toBeNull();
  });

  it('registers a new user who can then log in', async () => {
    const payload = { email: 'New.Player@Example.com', password: 'secret123', confirmPassword: 'secret123' };
    const res = await ctx.app.inject({ method: 'POST', url: '/api/auth/register', payload });
    expect(res.statusCode).toBe(201);
    expect(res.json().username).toBe('newplayer');

    const again = await ctx.app.inject({ method: 'POST', url: '/api/auth/register', payload });
    expect(again.statusCode).toBe(409);

    const loginRes = await ctx.app.inject({ method: 'POST', url: '/api/auth/login', payload: { email: 'new.player@example.com', password: 'secret123' } });
    expect(loginRes.statusCode).toBe(200);
  });

  it('gives a numbered username when the e-mail prefix is taken', async () => {
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/auth/register',
      payload: { email: 'alice_g@other.com', password: 'secret123', confirmPassword: 'secret123' },
    });
    expect(res.json().username).toBe('alice_g2');
  });

  it('rejects mismatched passwords and bad e-mails', async () => {
    const mismatch = await ctx.app.inject({
      method: 'POST', url: '/api/auth/register',
      payload: { email: 'x@y.com', password: 'secret123', confirmPassword: 'other123' },
    });
    expect(mismatch.statusCode).toBe(400);
    expect(mismatch.json().message).toBe('Passwords do not match.');

    const badEmail = await ctx.app.inject({
      method: 'POST', url: '/api/auth/register',
      payload: { email: 'not-an-email', password: 'secret123', confirmPassword: 'secret123' },
    });
    expect(badEmail.statusCode).toBe(400);
  });
});
