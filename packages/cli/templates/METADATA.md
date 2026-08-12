# Feature metadata.json reference

Each feature folder under `templates/react/` or `templates/next/` includes a `metadata.json` plus `ts/` and `js/` template trees.

## Core fields

| Field | Description |
|-------|-------------|
| `name` | Feature identifier (folder name) |
| `order` | Sort order when multiple features apply (lower first) |
| `enabledWhen` | `always`, `typescript`, `i18n`, `tailwind`, `store:redux`, `store:zustand`, `architecture:spa`, `architecture:router-v7` |
| `dependencies` / `devDependencies` | Merged into `package.json` |
| `devDependenciesToRemove` | Stripped from `package.json` after merge |
| `packageScripts` | Script overrides (React/Vite) |

## Provider composition

| Field | Description |
|-------|-------------|
| `providerWrapper.imports` | Import lines for `root-provider` |
| `providerWrapper.component` | JSX open tag wrapped around `{children}` |
| `rootProviderProps` / `rootProviderTypeImports` | Next client provider signature (i18n) |
| `layoutTarget` / `layoutProviderProps` | Next layout shell injection |

## Vite (React only)

| Field | Description |
|-------|-------------|
| `vite.imports` / `vite.plugins` | Vite config assembly |
| `vite.prependPlugins` | Plugins inserted before others |
| `vite.usePathAlias` | Enables `@/*` alias |
| `vite.replaceReactPlugin` | Swaps `@vitejs/plugin-react` for router |

React Compiler is configured by the official scaffolder (`create-vite` `react-compiler` / `react-compiler-ts`, or `create-next-app --react-compiler`), not via a feature template.

ESLint is configured by the official scaffolder (`create-vite --eslint` for Vite, `create-next-app --eslint` for Next).

## Entry hydration (React/Vite)

| Field | Description |
|-------|-------------|
| `entryHydration.imports.spa` | Imports prepended to `src/app/main.tsx` |
| `entryHydration.imports.router-v7` | Imports prepended to `src/app/root.tsx` |

## Cleanup

| Field | Description |
|-------|-------------|
| `cleanup.cleanupStores` | Remove erroneous `store/stores` directory |
| `cleanup.removeLegacyRouterRootFiles` | Delete legacy router files under `src/` |
| `cleanup.removeLegacyViteEntry` | Delete legacy `src/main`, `src/App`, etc. (post-entry) |
| `cleanup.removeWrongViteConfig` | Delete conflicting `vite.config` extension |
| `cleanup.files` | Additional relative paths to delete |

## Next-only

| Field | Description |
|-------|-------------|
| `nextConfig` | Keep feature-provided `next.config` instead of default |

## Shared templates

`templates/shared/` is copied first for every project (not a feature flag). It provides:

- `src/features/home/` — feature module scaffold
- `src/utils/` — shared utilities (`localStorage`, `cookies`)
- `src/app/page.tsx` — default Next page (overridden by i18n when enabled)
