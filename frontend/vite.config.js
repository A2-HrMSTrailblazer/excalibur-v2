import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const backend = process.env.BACKEND_URL || 'http://localhost:3000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // During development the API and uploaded images come from the Fastify server.
    proxy: {
      '/api': backend,
      '/uploads': backend,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**'],
      // projectRoot '..' writes paths like frontend/src/App.jsx, which SonarQube resolves from the repo root.
      reporter: ['text', 'html', ['lcov', { projectRoot: '..' }]],
      reportsDirectory: 'coverage',
      thresholds: { statements: 70, branches: 60, functions: 60, lines: 70 },
    },
  },
});
