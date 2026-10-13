import pg from 'pg';

// NUMERIC comes back from pg as a string by default; prices in this app fit safely in a JS number.
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => Number.parseFloat(value));

export function createDb(connectionString) {
  const pool = new pg.Pool({ connectionString, max: 10 });

  return {
    pool,
    async query(text, params = []) {
      const result = await pool.query(text, params);
      return result.rows;
    },
    async one(text, params = []) {
      const result = await pool.query(text, params);
      return result.rows[0] ?? null;
    },
    /** Runs fn inside a transaction; fn receives a client-like object with query(). */
    async tx(fn) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const tx = {
          query: async (text, params = []) => (await client.query(text, params)).rows,
          one: async (text, params = []) => (await client.query(text, params)).rows[0] ?? null,
        };
        const result = await fn(tx);
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    },
    close() {
      return pool.end();
    },
  };
}
