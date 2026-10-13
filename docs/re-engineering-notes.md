# Re-engineering notes (SE262 → SE327)

Notes for the report and the Reflection section: what changed, what we found while porting, and some numbers.

## 1. Stack, before and after

| Component | SE262 | SE327 | Biggest practical difference |
|---|---|---|---|
| UI framework | Bootstrap 5 (CDN) + 21 custom CSS files | Tailwind CSS 4 + DaisyUI 5 | Styling sits in the markup as utility classes; the theme colours (`#00001A`, `#222584`, `#FFCC00`) became two DaisyUI themes in one CSS file instead of CSS variables spread over many files. |
| Frontend | EJS templates rendered by Express, plus page scripts that re-fetched HTML (`checkout.js` parsed the whole page with `DOMParser` to refresh the cart) | React 19 SPA built with Vite | State (cart, user, modals) lives in React; the cart updates without reloading or HTML scraping. Needed a JSON API that did not exist before. |
| Backend | Express 5 + express-session (memory store) + multer | Fastify 5 + @fastify/secure-session + @fastify/multipart | JSON-schema validation on every route body; `app.inject()` makes HTTP tests fast without opening a port. |
| Database | MySQL 8 (`mysql2`) | PostgreSQL 16 (`pg`) | Stricter SQL, real ENUM types, `LATERAL` joins, `FOR UPDATE SKIP LOCKED`, `ILIKE`. |

## 2. Feature parity checklist

| SE262 route | SE327 page | API endpoint |
|---|---|---|
| `GET /` | `/` Home (Nintendo / Top games / Recommended) | `GET /api/home` |
| `GET /store` (search, platform, min/max price, page) | `/store` | `GET /api/games` |
| `GET /product/:id` | `/product/:id` (price chart with 1m/3m/All zoom, reviews) | `GET /api/games/:id` |
| `GET /cart`, `POST /add-to-cart`, `/update-cart`, `/remove-from-cart` | `/cart` | `GET/POST /api/cart`, `PATCH/DELETE /api/cart/:gameId` |
| `GET /checkout`, `POST /process-checkout` | `/checkout` (PromptPay QR / TrueMoney modal, 15-min timer) | `GET /api/checkout/payment-methods`, `POST /api/checkout` |
| `GET /orders` | `/orders` (keys per game) | `GET /api/orders` |
| `GET /review`, `POST /submit-review` | `/review/:id` (4 detailed ratings → overall) | `POST /api/games/:id/reviews` |
| `GET /profile`, `POST /update-profile` | `/profile` | `GET/PATCH /api/profile` |
| `GET/POST /login`, `/register`, `GET /logout` | `/login`, `/register`, menu → Logout | `/api/auth/*` |
| `GET /about`, `GET /contact` | `/about`, `/contact` | — |
| `GET /admin/dashboard` | `/admin/dashboard` | `GET /api/admin/dashboard` |
| `/admin/products` (+ add / edit / delete, image upload) | `/admin/products` | `/api/admin/products` |
| `/admin/categories` (+ add / edit / delete) | `/admin/categories` | `/api/admin/categories` |
| `/admin/game-keys` (+ add / delete) | `/admin/game-keys` | `/api/admin/keys` |
| `/admin/users`, `/orders`, `/payments?type=`, `/reviews` (+ view modals) | same paths | `/api/admin/users`, `/orders`, `/payments`, `/reviews` |

## 3. Problems in the SE262 code that the rewrite exposed (and fixed)

These only became visible because we had to read every query again and write tests for it.

1. **Plain-text passwords.** `user.password` was compared with `WHERE email = ? AND password = ?`. Now bcrypt hashes (`password_hash`).
2. **Admin login was an `.env` e-mail/password pair**, not a user. Now `users.role = 'admin'`.
3. **The client chose the price.** "Add to cart" posted `price` from a hidden form field and checkout trusted it. Now the cart stores only game id + quantity and every price is read from the database.
4. **Adding a game key always failed.** `createKey` inserted into `digital_key.Categories_id`, but `init.sql` drops that column at the end. The platform now comes from the game.
5. **Deleting a key always failed.** The controller called `gameKeyModel.getKeyById`, which never existed. Fixed, and sold keys are protected (409).
6. **Deleting a product always failed** for seeded games because their keys reference them. Now allowed when nothing was sold (unsold keys and reviews are removed); blocked with a clear message otherwise.
7. **Registering could crash** when the e-mail prefix was already a username (UNIQUE constraint). Now a number is added (`alice_g2`).
8. **Revenue included refunded orders.** Dashboard revenue and the sales chart now exclude refunded and failed orders.
9. **Users table showed `Total orders: 0`** for everyone (hard-coded placeholder). Now counted.
10. **Hard-coded session secret** (`'excalibur-secret'`). Now from `SESSION_SECRET`.
11. **Mixed currencies** (USD on cards, ฿ on the review page and admin form). Now USD everywhere.
12. **Open redirect** risk on `returnTo` after login. Only in-site paths are accepted.
13. **No automated tests.** Now 125 tests with coverage thresholds.

## 4. MySQL → PostgreSQL: things we had to change

| MySQL | PostgreSQL | Why it mattered |
|---|---|---|
| Tables `user`, `` `order` `` | `users`, `orders` | Both are reserved words in PostgreSQL. |
| `Categories_id`, `Totalspend`, column `DATE` | `category_id`, `total_spend`, `sold_date` | Mixed-case names need quotes in PostgreSQL; lower snake_case avoids that. |
| `ENUM('QR','TRUEMONEY')` on the column | `CREATE TYPE payment_method AS ENUM (...)` | Enums are named types. |
| `AUTO_INCREMENT` | `GENERATED BY DEFAULT AS IDENTITY` + `setval()` after seeding explicit ids | Otherwise the next insert collides with seeded ids. |
| `?` placeholders | `$1, $2, …` | Different driver syntax; every query was rewritten. |
| `RAND()`, `DATE_FORMAT`, `LAST_DAY`, `DATE_SUB` | `random()`, `to_char`, `date_trunc`, `generate_series` | Function names differ; the monthly sales chart is now one query. |
| `status = "Available"` matched `'available'` | Enum comparison is exact | MySQL's case-insensitive compare had hidden the mismatch. |
| `LIKE` (case-insensitive by collation) | `ILIKE` | Search would have become case-sensitive. |
| `DECIMAL` → JS number | `NUMERIC` → **string** in `pg` | Needed a type parser, or `price * qty` would concatenate strings. |
| Same correlated sub-query for "current price" and "stock" copied into 6 controllers | One `game_catalog` view with `LEFT JOIN LATERAL` | One place to change, simpler queries. |
| `SELECT ... FOR UPDATE` | `FOR UPDATE SKIP LOCKED` | Two buyers checking out at once never wait on or get the same key. |

## 5. Numbers

Measured with `cloc` (code lines, no blanks/comments; the SQL seed excluded).

| | SE262 | SE327 |
|---|---|---|
| Application code | 8,429 lines (CSS 3,108 · EJS 2,766 · JS 2,201 · HTML 340) | ≈ 3,350 lines (backend 1,071 · frontend ≈ 2,275 incl. 57 lines of CSS) |
| Test code | 0 | ≈ 1,440 lines |
| Automated tests | 0 | 125 (72 backend, 53 frontend) |
| Statement / branch coverage | — | backend 99% / 97%, frontend 96% / 90% |
| Custom CSS | 3,108 lines in 21 files | 57 lines (theme tokens) |
| Database schema | 9 tables + 7 fix-up `ALTER`s | 9 tables + 1 view, no fix-ups |

Re-run these yourself before the presentation if the code changes (`npx cloc backend/src frontend/src`).

## 6. Ideas for the Reflection section

- **UI:** Tailwind/DaisyUI removed almost all custom CSS, but long class lists make JSX harder to scan. DaisyUI components (modal, drawer, table, badge, join) replaced Bootstrap's almost one-to-one.
- **Frontend:** React made the cart and checkout simpler, but forced us to design an API and handle loading states. We hit one real bug: Checkout redirected to the cart before the cart had loaded (fixed by tracking `loaded` per user).
- **Backend:** Fastify's schema validation replaced many hand-written `if` checks; `inject()` made 72 integration tests run in a few seconds.
- **Database:** PostgreSQL's strictness found bugs MySQL had hidden (case-insensitive enum compare, missing column). The `pg` NUMERIC-as-string behaviour was the most surprising.
- **Process:** coverage thresholds + SonarQube quality gate on every PR stopped "it works on my machine" merges.
