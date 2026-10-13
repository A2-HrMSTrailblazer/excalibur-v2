import { buildApp } from './app.js';
import { loadConfig, loadEnvFile } from './config.js';
import { createDb } from './db.js';

loadEnvFile();
const config = loadConfig();
const db = createDb(config.databaseUrl);
const app = await buildApp({ db, config, logger: true });

const shutdown = async () => {
  await app.close();
  await db.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await app.listen({ port: config.port, host: config.host });
