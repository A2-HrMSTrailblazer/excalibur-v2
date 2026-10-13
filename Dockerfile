# --- 1. Build the React frontend ---------------------------------------------
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- 2. Run the Fastify backend, which also serves the built frontend --------
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/src ./src
COPY backend/db ./db
COPY backend/scripts ./scripts
COPY --from=frontend /app/frontend/dist /app/frontend/dist
RUN mkdir -p uploads && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
