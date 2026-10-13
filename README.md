# Excalibur v2 — SE327 Technology Re-engineering

Excalibur is the game-key web store from our SE262 project, rebuilt with a completely new stack for the SE327 term project.

| Component | SE262 (original) | SE327 (this repo) |
|---|---|---|
| UI framework | Bootstrap 5 + 3,100 lines of custom CSS | **Tailwind CSS 4 + DaisyUI 5** (two custom themes) |
| Frontend | EJS server-rendered templates + vanilla JS | **React 19 (Vite 7)** single-page app, React Router 7 |
| Backend | Node.js / Express 5 | **Fastify 5** JSON REST API |
| Database | MySQL 8 | **PostgreSQL 16** |

Group: Excalibur. See `docs/re-engineering-notes.md` for the before/after comparison used in the report.

---

## Quick start (Windows, macOS or Linux)

You need **Node.js 20.12+** (22 recommended) and **PostgreSQL 16**. The easiest way to get PostgreSQL is Docker Desktop.

### 1. Database

With Docker (creates the `excalibur` database with all seed data, plus an empty `excalibur_test` database for tests):

```bash
docker compose up -d db
```

Without Docker: install PostgreSQL, create a user `excalibur` / password `excalibur`, create the databases `excalibur` and `excalibur_test`, then run `npm run db:reset` in step 2.

### 2. Backend

```bash
cd backend
cp .env.example .env        # PowerShell: Copy-Item .env.example .env
npm install
npm run db:reset            # only if you did NOT use Docker for the database
npm run dev                 # API on http://localhost:3000
```

### 3. Frontend (second terminal)

```bash
cd frontend
npm install
npm run dev                 # site on http://localhost:5173 (proxies /api and /uploads to :3000)
```

### 4. Images

The game covers, logos and icons are the same files as SE262. Copy them from the old repo:

| From the SE262 repo | To this repo |
|---|---|
| `asset/` | `frontend/public/asset/` |
| `uploads/` | `backend/uploads/` |

Without them the site still works and shows placeholders.

### Seed accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@excalibur.com | admin1234 |
| Customer | alice.gamer@gmail.com | P@ssw0rd!Alice |
| Customer | bob.plays2024@gmail.com | B0bSecure#2024 |

Change the admin password before deploying anywhere public.

### Run everything in Docker

```bash
docker compose up -d --build     # http://localhost:3000 (Fastify serves the built React app)
```

---

## Tests and coverage

```bash
cd backend  && npm run coverage   # 72 tests, against the real excalibur_test PostgreSQL database
cd frontend && npm run coverage   # 53 tests, React Testing Library + jsdom
```

Both commands print statement **and** branch coverage, write `coverage/lcov.info` for SonarQube, and **fail if coverage drops below the thresholds** in `backend/vitest.config.js` and `frontend/vite.config.js`. That is our local quality gate.

| | Statements | Branches |
|---|---|---|
| Backend | 99% | 97% |
| Frontend | 96% | 90% |

Backend tests reset and re-seed `excalibur_test` before each test file, so they never touch your real data. Set `TEST_DATABASE_URL` in `backend/.env` if your database is somewhere else.

## SonarQube and quality gate

1. Start SonarQube: `docker compose --profile sonar up -d sonarqube`, open http://localhost:9000, log in with admin / admin and set a new password.
2. Create a project manually with key **`excalibur-v2`**, choose "Locally", and generate a token.
3. Make the coverage reports: run `npm run coverage` in `backend/` and in `frontend/`.
4. Run the scanner from the repo root:

   ```powershell
   # Windows (PowerShell)
   docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 -e SONAR_TOKEN=<your-token> -v "${PWD}:/usr/src" sonarsource/sonar-scanner-cli
   ```

   ```bash
   # macOS / Linux
   docker run --rm --network host -e SONAR_HOST_URL=http://localhost:9000 -e SONAR_TOKEN=<your-token> -v "$PWD:/usr/src" sonarsource/sonar-scanner-cli
   ```

5. Open the project in SonarQube. Settings come from `sonar-project.properties`.
6. Quality gate: use the built-in **Sonar way** gate, or create your own in **Quality Gates**, for example: coverage on new code ≥ 80%, duplicated lines ≤ 3%, no new bugs or vulnerabilities, security hotspots reviewed. Assign it to the project.

GitHub Actions (`.github/workflows/ci.yml`) runs lint, tests, coverage thresholds and build on every push and pull request. If you add `SONAR_TOKEN` and `SONAR_HOST_URL` repository secrets (for example with SonarCloud), it also runs the SonarQube scan and waits for the quality gate.

## Git workflow

See `CONTRIBUTING.md`: `main` ← `develop` ← `feature/*` branches, every change through a pull request reviewed by the other member.

## Project structure

```
backend/
  db/schema.sql, db/seed.sql   PostgreSQL schema + seed (converted from SE262 init.sql)
  src/app.js                   Fastify app (plugins, routes, error handler)
  src/routes/                  auth, catalog, cart, checkout, orders, reviews, profile
  src/routes/admin/            dashboard, products, categories, keys, users/orders/payments/reviews lists
  test/                        Vitest + app.inject() integration tests
frontend/
  src/pages/client/            Home, Store, ProductDetail, Cart, Checkout, Orders, Profile, Review, Login, Register, About, Contact
  src/pages/admin/             Dashboard, Products, Categories, GameKeys, Users, Orders, Payments, Reviews
  src/components/              Header, ProductCard, Pagination, Modal, PriceChart, …
  src/index.css                Tailwind + DaisyUI themes (storefront dark, back-office light)
```

## API overview

| Method | Path | Notes |
|---|---|---|
| POST | /api/auth/register, /api/auth/login, /api/auth/logout | Session cookie (encrypted, httpOnly) |
| GET | /api/auth/me | Current user or null |
| GET | /api/categories, /api/home | Platforms; home page sections |
| GET | /api/games?search&platform&minPrice&maxPrice&page | Store, 15 per page |
| GET | /api/games/:id, /api/games/random | Detail with price history + reviews |
| GET/POST/PATCH/DELETE | /api/cart, /api/cart/:gameId | Login required, stock checked |
| GET/POST | /api/checkout/payment-methods, /api/checkout | Assigns real keys in a transaction |
| GET | /api/orders | Your orders with keys |
| POST | /api/games/:id/reviews | One review per user per game (min 150 chars) |
| GET/PATCH | /api/profile | Change username |
| GET | /api/admin/dashboard | Admin only |
| GET/POST/PUT/DELETE | /api/admin/products, /api/admin/categories, /api/admin/keys | Admin CRUD (products use multipart for images) |
| GET | /api/admin/users, /orders, /payments?type, /reviews | Searchable, paginated lists |
