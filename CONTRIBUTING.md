# Git workflow

We use a simple Git Flow:

```
main       ← stable, demo-ready. Only updated by a PR from develop.
develop    ← integration branch. All feature PRs target this.
feature/*  ← one branch per task, e.g. feature/store-filters, fix/cart-stock, test/admin-api, chore/sonar
```

## Rules

1. Never push straight to `main` or `develop`. Turn on branch protection in **GitHub → Settings → Branches → Add rule** for both branches:
   - Require a pull request before merging, with 1 approval
   - Require status checks to pass: `Backend (Fastify + PostgreSQL)` and `Frontend (React + Vite)`
2. One task = one branch = one PR. Keep PRs small enough to review in 10 minutes.
3. The other member reviews and approves. Fix comments with new commits, then **Squash and merge**.
4. Commit messages use the Conventional Commits style:
   `feat(store): filter by platform`, `fix(cart): block quantity above stock`, `test(api): checkout rollback`, `chore(ci): add sonar job`.
5. Before opening a PR, run `npm run lint` and `npm run coverage` in the folder you changed.
6. If SonarQube reports new issues, fix them in the same PR, or open a follow-up `fix/sonar-*` PR and link it.

## Typical flow

```bash
git switch develop
git pull
git switch -c feature/store-filters
# ...work, commit...
git push -u origin feature/store-filters
# open a PR into develop on GitHub, ask your teammate to review
```

When `develop` is ready for the presentation, open a PR `develop → main` titled `release: v2.0`.
