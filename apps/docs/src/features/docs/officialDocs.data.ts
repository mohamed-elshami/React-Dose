export type OfficialDocLink = {
  label: string;
  href: string;
  note?: string;
};

/** Canonical official documentation for libraries React Dose scaffolds with. */
export const officialDocs = {
  vite: {
    label: "Vite",
    href: "https://vite.dev/guide/",
  },
  createVite: {
    label: "create-vite",
    href: "https://vite.dev/guide/#scaffolding-your-first-vite-project",
  },
  nextjs: {
    label: "Next.js",
    href: "https://nextjs.org/docs",
  },
  createNextApp: {
    label: "create-next-app",
    href: "https://nextjs.org/docs/app/api-reference/cli/create-next-app",
  },
  reactRouter: {
    label: "React Router",
    href: "https://reactrouter.com/home",
  },
  createReactRouter: {
    label: "create-react-router",
    href: "https://reactrouter.com/start/framework/installation",
  },
  react: {
    label: "React",
    href: "https://react.dev/",
  },
  typescript: {
    label: "TypeScript",
    href: "https://www.typescriptlang.org/docs/",
  },
  eslint: {
    label: "ESLint",
    href: "https://eslint.org/docs/latest/",
  },
  eslintConfigNext: {
    label: "eslint-config-next",
    href: "https://nextjs.org/docs/app/api-reference/config/eslint",
  },
  oxlint: {
    label: "Oxlint",
    href: "https://oxc.rs/docs/guide/usage/linter.html",
  },
  reactCompiler: {
    label: "React Compiler",
    href: "https://react.dev/learn/react-compiler",
  },
  zustand: {
    label: "Zustand",
    href: "https://zustand.docs.pmnd.rs/",
  },
  reduxToolkit: {
    label: "Redux Toolkit",
    href: "https://redux-toolkit.js.org/",
  },
  reactRedux: {
    label: "React Redux",
    href: "https://react-redux.js.org/",
  },
  tailwind: {
    label: "Tailwind CSS",
    href: "https://tailwindcss.com/docs",
  },
  tailwindVite: {
    label: "Tailwind + Vite",
    href: "https://tailwindcss.com/docs/installation/using-vite",
  },
  i18next: {
    label: "i18next",
    href: "https://www.i18next.com/",
  },
  reactI18next: {
    label: "react-i18next",
    href: "https://react.i18next.com/",
  },
  nextIntl: {
    label: "next-intl",
    href: "https://next-intl.dev/",
  },
  nodejs: {
    label: "Node.js",
    href: "https://nodejs.org/docs/latest/api/",
  },
} as const satisfies Record<string, OfficialDocLink>;
