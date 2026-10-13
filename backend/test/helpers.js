import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { buildApp } from '../src/app.js';
import { loadConfig, loadEnvFile } from '../src/config.js';

loadEnvFile();
import { createDb } from '../src/db.js';
import { resetDatabase } from '../scripts/db-reset.js';

export const TEST_DB_URL =
  process.env.TEST_DATABASE_URL || 'postgres://excalibur:excalibur@localhost:5432/excalibur_test';

export const USERS = {
  alice: { email: 'alice.gamer@gmail.com', password: 'P@ssw0rd!Alice' },
  bob: { email: 'bob.plays2024@gmail.com', password: 'B0bSecure#2024' },
  admin: { email: 'admin@excalibur.com', password: 'admin1234' },
};

/** Fresh seeded database + app instance for one test file. */
export async function setupApp({ frontendDist } = {}) {
  await resetDatabase(TEST_DB_URL);
  const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'excalibur-uploads-'));
  const config = {
    ...loadConfig({}),
    databaseUrl: TEST_DB_URL,
    uploadDir,
    frontendDist: frontendDist ?? path.join(uploadDir, 'no-frontend'),
  };
  const db = createDb(TEST_DB_URL);
  const app = await buildApp({ db, config });
  return {
    app,
    db,
    uploadDir,
    async close() {
      await app.close();
      await db.close();
      fs.rmSync(uploadDir, { recursive: true, force: true });
    },
  };
}

/** Logs in and returns the session cookie header value. */
export async function login(app, who) {
  const res = await app.inject({ method: 'POST', url: '/api/auth/login', payload: USERS[who] });
  if (res.statusCode !== 200) throw new Error(`login failed for ${who}: ${res.body}`);
  const cookie = res.cookies.find((c) => c.name === 'excalibur_session');
  return `excalibur_session=${encodeURIComponent(cookie.value)}`;
}

/** Wraps app.inject so the session cookie follows along like a browser would. */
export function client(app, cookie) {
  const state = { cookie };
  const send = async (method, url, payload, headers = {}) => {
    const res = await app.inject({
      method,
      url,
      payload,
      headers: { ...(state.cookie ? { cookie: state.cookie } : {}), ...headers },
    });
    const updated = res.cookies.find((c) => c.name === 'excalibur_session');
    if (updated) state.cookie = `excalibur_session=${encodeURIComponent(updated.value)}`;
    return res;
  };
  return {
    get: (url) => send('GET', url),
    post: (url, payload, headers) => send('POST', url, payload, headers),
    put: (url, payload, headers) => send('PUT', url, payload, headers),
    patch: (url, payload) => send('PATCH', url, payload),
    delete: (url) => send('DELETE', url),
  };
}

export const longText = (n = 160) => 'This game is great. '.repeat(Math.ceil(n / 20)).slice(0, n);

/** Builds a multipart/form-data body by hand (no extra dependency needed). */
export function multipartBody(fields, file) {
  const boundary = '----excaliburtest' + Date.now();
  const chunks = [];
  for (const [name, value] of Object.entries(fields)) {
    chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
  }
  if (file) {
    chunks.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${file.field ?? 'image'}"; filename="${file.filename}"\r\n` +
      `Content-Type: ${file.type ?? 'image/png'}\r\n\r\n`,
    ));
    chunks.push(file.content ?? Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    chunks.push(Buffer.from('\r\n'));
  }
  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  return { payload: Buffer.concat(chunks), headers: { 'content-type': `multipart/form-data; boundary=${boundary}` } };
}
