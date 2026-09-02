# Publishing `create-react-dose` to npm

Step-by-step checklist for the **first public release** (v1.0.0).

## Before you publish

### 1. npm account and package name

1. Create or sign in at [npmjs.com](https://www.npmjs.com/).
2. Confirm the name **`create-react-dose`** is available (or claim it if you already own it).
3. Optional: create an npm org if you plan scoped packages later (`@react-dose/*`).

### 2. Local validation

From the repo root:

```bash
pnpm install
node packages/cli/scripts/validate-package.mjs
node packages/cli/scripts/scaffold-verify.mjs
```

Dry-run the tarball (lists files that would ship):

```bash
cd packages/cli
npm pack --dry-run
```

You should see only: `src/`, `templates/`, `README.md`, `CHANGELOG.md`, and `package.json`. No `scripts/`, no lockfiles.

### 3. GitHub release workflow

The monorepo uses [Changesets](https://github.com/changesets/changesets) and `.github/workflows/release.yml`.

Add **`NPM_TOKEN`** to GitHub repository secrets:

1. npm → Access Tokens → Generate **Automation** token (publish).
2. GitHub repo → Settings → Secrets and variables → Actions → New repository secret → `NPM_TOKEN`.

`@react-dose/ui` is **`private: true`** so only `create-react-dose` is published until the UI package is ready.

## First publish (manual)

### Option A — publish from `packages/cli` only

```bash
cd packages/cli
npm login
npm publish --access public
```

`prepublishOnly` runs `validate-package.mjs` automatically.

### Option B — Changesets (recommended for the monorepo)

1. Add a changeset when you have releasable changes:

   ```bash
   pnpm changeset
   ```

   Select `create-react-dose`, choose patch/minor/major.

2. Merge changesets PR or run locally:

   ```bash
   pnpm changeset version
   git add -A && git commit -m "chore: version packages"
   ```

3. Publish (after `NPM_TOKEN` is set for CI, or locally):

   ```bash
   pnpm changeset publish
   ```

   Or push to `main` and let `release.yml` publish on the version commit.

## After publish

Smoke test:

```bash
npx create-react-dose@latest ./smoke-test-app
cd smoke-test-app
pnpm install
pnpm build
```

Update README badges and any docs that reference `@react-dose/cli` — the npm package name is **`create-react-dose`**.

## Versioning

- **1.0.0** — first public release (current).
- Use Changesets for subsequent releases; keep `CHANGELOG.md` in `packages/cli` updated via `changeset version`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `403 Forbidden` on publish | Wrong token, not logged in, or name taken by another user |
| `prepublishOnly` fails | Run `validate-package.mjs` and fix missing templates |
| Published wrong files | Check `files` in `package.json`; re-publish with fixed version |
| `npx` runs old version | Use `@latest` or explicit version: `create-react-dose@1.0.0` |
