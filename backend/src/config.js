import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Loads backend/.env into process.env if it exists (Node 20.12+ built-in, no dotenv needed). */
export function loadEnvFile(file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env')) {
  try {
    process.loadEnvFile(file);
    return true;
  } catch {
    return false;
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function loadConfig(env = process.env) {
  return {
    port: Number(env.PORT || 3000),
    host: env.HOST || '0.0.0.0',
    databaseUrl: env.DATABASE_URL || 'postgres://excalibur:excalibur@localhost:5432/excalibur',
    sessionSecret: env.SESSION_SECRET || 'dev-only-secret-change-me-please-32chars!!',
    sessionSalt: env.SESSION_SALT || 'excalibur-salt16',
    uploadDir: env.UPLOAD_DIR || path.join(root, 'uploads'),
    frontendDist: env.FRONTEND_DIST || path.join(root, '..', 'frontend', 'dist'),
    production: env.NODE_ENV === 'production',
    // Set COOKIE_SECURE=true when the site is served over HTTPS.
    cookieSecure: env.COOKIE_SECURE === 'true',
  };
}
