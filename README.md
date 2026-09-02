# React Dose Ecosystem

Monorepo for the React Dose tooling and libraries.

| Package | npm | Status |
|---------|-----|--------|
| [`create-react-dose`](packages/cli/) | `npx create-react-dose@latest` | **v1 — ready to publish** |
| [`@react-dose/ui`](packages/ui/) | `@react-dose/ui` | Private — not on npm yet |

## Quick start

```bash
npx create-react-dose@latest
```

See the [CLI README](packages/cli/README.md) for stacks, options, and architecture.

## Development

```bash
pnpm install
pnpm --filter create-react-dose dev
```

Verify scaffolding locally:

```bash
node packages/cli/scripts/scaffold-verify.mjs
```

## Publishing the CLI

See [packages/cli/NPM_PUBLISH.md](packages/cli/NPM_PUBLISH.md).

## License

MIT
