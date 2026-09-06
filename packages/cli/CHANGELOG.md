# create-react-dose

## 1.0.3

### Patch Changes

- Point the npm homepage and scaffolded landing-page CTA at the live docs site (https://react-dose-docs.vercel.app).

## 1.0.2

- npm `homepage` points to the docs site: https://react-dose-docs.vercel.app
- Scaffolded landing page puts **React Dose docs** first (primary CTA)
- README links the live docs site

## 1.0.1

- README logo uses a GitHub raw URL so it renders on npm
- Package repository/homepage links point to `mohamed-elshami/React-Dose`

## 1.0.0

### Initial public release

- Interactive CLI for **Vite SPA**, **React Router v7**, and **Next.js App Router**
- Official scaffolders first (Vite, `create-next-app`, `create-react-router`), then React Dose architecture injection
- Feature-first folder layout: `src/app`, `src/features`, `src/utils`
- Branded landing page, favicon, and stack-specific docs links
- Optional **TypeScript**, **Tailwind CSS**, **React Compiler**, **Zustand**, **Redux Toolkit**, and **i18n**
- Metadata-driven provider composition via `root-provider`
- Pinned official scaffolder majors with `REACT_DOSE_SCAFFOLD_LATEST` override for testing

Run with:

```bash
npx create-react-dose@latest
```
