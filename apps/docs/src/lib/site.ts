export const SITE_NAME = "React Dose";
export const SITE_TAGLINE =
  "Feature-first scaffolding for React — Vite, Next.js, and React Router.";

export const SITE_DESCRIPTION =
  "create-react-dose scaffolds feature-first React apps on Vite, Next.js, or React Router. Official tooling first, scalable architecture second.";

const DEFAULT_SITE_URL = "https://react-dose.vercel.app";

function resolveSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const host = vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  return DEFAULT_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();

export const SITE_TWITTER = "@Fekra-2025";

export const GITHUB_REPO = "https://github.com/mohamed-elshami/React-Dose";
export const NPM_PACKAGE = "https://www.npmjs.com/package/create-react-dose";
export const AUTHOR_URL = "https://github.com/mohamed-elshami";
export const AUTHOR_NAME = "Mohamed Samir Elshami";

export const DOC_ROUTES = [
  { path: "/docs", title: "Introduction" },
  { path: "/docs/getting-started", title: "Getting started" },
  { path: "/docs/stacks", title: "Supported stacks" },
  { path: "/docs/options", title: "Interactive options" },
  { path: "/docs/options/path", title: "Project path" },
  { path: "/docs/options/framework", title: "Framework" },
  { path: "/docs/options/architecture", title: "Architecture" },
  { path: "/docs/options/linter", title: "Linter" },
  { path: "/docs/options/typescript", title: "TypeScript" },
  { path: "/docs/options/react-compiler", title: "React Compiler" },
  { path: "/docs/options/store", title: "State store" },
  { path: "/docs/options/tailwind", title: "Tailwind CSS" },
  { path: "/docs/options/i18n", title: "i18n" },
  { path: "/docs/architecture", title: "Feature-first layout" },
  { path: "/docs/environment", title: "Environment variables" },
] as const;

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
