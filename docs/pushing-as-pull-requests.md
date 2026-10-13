# Pushing this code as a series of pull requests

The rubric checks the git workflow, so don't push everything in one commit. Push it in small PRs, split between the two of us. (Person A = backend + process, Person B = frontend + UI.)

Unzip the delivered folder somewhere outside the repo, for example `C:\Users\you\Downloads\excalibur-v2`. Below, `$SRC` is that folder and you run the commands inside your **new, empty repo** clone. Commands are PowerShell.

```powershell
$SRC = "C:\Users\you\Downloads\excalibur-v2"
function Take($path) {
  $parent = Split-Path (Join-Path . $path) -Parent
  New-Item -ItemType Directory -Force $parent | Out-Null
  Copy-Item -Recurse -Force (Join-Path $SRC $path) $parent
}
```

## 0. Initial commit on `main` (either person)

```powershell
mkdir backend, frontend, docs -Force | Out-Null
Take README.md; Take CONTRIBUTING.md; Take .gitignore; Take package.json; Take docs
git add .; git commit -m "chore: project setup and docs"; git push origin main
git switch -c develop; git push -u origin develop
```

Then turn on branch protection for `main` and `develop` (see CONTRIBUTING.md).

## PRs into `develop`

| # | Branch | Who | Copy | Commit message |
|---|---|---|---|---|
| 1 | `feature/postgres-schema` | A | `backend/db`, `backend/scripts`, `backend/package.json`, `backend/package-lock.json`, `backend/.env.example` | `feat(db): PostgreSQL schema and seed converted from MySQL` |
| 2 | `feature/fastify-api` | A | `backend/src`, `backend/eslint.config.js`, `backend/uploads` | `feat(api): Fastify REST API for store, cart, checkout and admin` |
| 3 | `test/backend` | A | `backend/test`, `backend/vitest.config.js` | `test(api): integration tests with coverage thresholds` |
| 4 | `feature/react-shell` | B | everything in `frontend/` **except** `frontend/src/pages` and `frontend/src/test` | `feat(ui): Vite + React app shell with Tailwind/DaisyUI themes` |
| 5 | `feature/store-pages` | B | `frontend/src/pages/client` | `feat(store): customer pages` |
| 6 | `feature/admin-pages` | B | `frontend/src/pages/admin` | `feat(admin): back-office pages` |
| 7 | `test/frontend` | B | `frontend/src/test` | `test(ui): component and page tests` |
| 8 | `chore/ci-docker-sonar` | A | `.github`, `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `sonar-project.properties`, `backend/db/create-test-db.sql` | `chore(ci): GitHub Actions, Docker and SonarQube config` |

For each row:

```powershell
git switch develop; git pull
git switch -c feature/postgres-schema
Take backend/db; Take backend/scripts; Take backend/package.json; Take backend/package-lock.json; Take backend/.env.example
git add .; git commit -m "feat(db): PostgreSQL schema and seed converted from MySQL"
git push -u origin feature/postgres-schema
# open the PR on GitHub → teammate reviews → Squash and merge
```

Row 4 (copy the frontend without pages/tests):

```powershell
Get-ChildItem (Join-Path $SRC frontend) -Force | Where-Object { $_.Name -notin 'node_modules','dist','coverage' } | ForEach-Object { Copy-Item -Recurse -Force $_.FullName .\frontend\ }
Remove-Item -Recurse -Force .\frontend\src\pages, .\frontend\src\test
```

Notes:

- PRs 4–6 won't build on their own because `App.jsx` imports the pages. That's fine before CI exists; if you'd rather each PR build, merge 4–7 as one PR.
- After PR 8, CI runs on every PR. **Then do the SonarQube part for real:** run a scan, screenshot the result, fix what it reports in `fix/sonar-*` PRs, scan again and screenshot the improvement. That before/after evidence is what the rubric asks for ("SonarQube that helps improve your process").
- Also copy the SE262 images (`asset/` → `frontend/public/asset/`, `uploads/` → `backend/uploads/`) in their own PR, e.g. `chore/assets`.
- Finish with a PR `develop → main` titled `release: v2.0`.
