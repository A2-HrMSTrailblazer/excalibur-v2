import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { loadConfig, loadEnvFile } from '../src/config.js';
import { setupApp } from './helpers.js';

describe('config', () => {
  it('loads a .env file when present and ignores a missing one', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'excalibur-env-'));
    const file = path.join(dir, '.env');
    fs.writeFileSync(file, 'EXCALIBUR_TEST_VALUE=42\n');
    expect(loadEnvFile(file)).toBe(true);
    expect(process.env.EXCALIBUR_TEST_VALUE).toBe('42');
    expect(loadEnvFile(path.join(dir, 'missing.env'))).toBe(false);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('uses defaults and reads env values', () => {
    expect(loadConfig({}).port).toBe(3000);
    const cfg = loadConfig({ PORT: '8080', NODE_ENV: 'production', DATABASE_URL: 'postgres://x' });
    expect(cfg).toMatchObject({ port: 8080, production: true, cookieSecure: false, databaseUrl: 'postgres://x' });
    expect(loadConfig({ COOKIE_SECURE: 'true' }).cookieSecure).toBe(true);
  });
});

describe('serving the built frontend', () => {
  let ctx;
  let dist;
  beforeAll(async () => {
    dist = fs.mkdtempSync(path.join(os.tmpdir(), 'excalibur-dist-'));
    fs.writeFileSync(path.join(dist, 'index.html'), '<html>excalibur spa</html>');
    ctx = await setupApp({ frontendDist: dist });
  });
  afterAll(async () => {
    await ctx.close();
    fs.rmSync(dist, { recursive: true, force: true });
  });

  it('serves index.html for client-side routes but JSON 404 for the api', async () => {
    const page = await ctx.app.inject({ url: '/store?search=mario' });
    expect(page.statusCode).toBe(200);
    expect(page.body).toContain('excalibur spa');
    expect((await ctx.app.inject({ url: '/api/missing' })).statusCode).toBe(404);
    expect((await ctx.app.inject({ method: 'POST', url: '/not-api' })).statusCode).toBe(404);
  });
});

describe('unexpected errors', () => {
  it('hides internal error details behind a 500', async () => {
    const brokenDb = { query: async () => { throw new Error('db exploded'); }, one: async () => { throw new Error('db exploded'); } };
    const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'excalibur-up-'));
    const app = await buildApp({ db: brokenDb, config: { ...loadConfig({}), uploadDir, frontendDist: uploadDir } });
    const res = await app.inject({ url: '/api/categories' });
    expect(res.statusCode).toBe(500);
    expect(res.json().message).toBe('Something went wrong. Please try again.');
    expect(res.body).not.toContain('exploded');
    await app.close();
    fs.rmSync(uploadDir, { recursive: true, force: true });
  });
});
