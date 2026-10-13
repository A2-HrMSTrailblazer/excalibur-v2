import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.js'],
    // Integration tests share one PostgreSQL test database, so run files one at a time.
    fileParallelism: false,
    testTimeout: 15000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['src/server.js'],
      // projectRoot '..' writes paths like backend/src/app.js, which SonarQube resolves from the repo root.
      reporter: ['text', 'html', ['lcov', { projectRoot: '..' }]],
      reportsDirectory: 'coverage',
      // Local quality gate: `npm run coverage` fails if coverage drops below these numbers.
      thresholds: { statements: 85, branches: 75, functions: 85, lines: 85 },
    },
  },
});
