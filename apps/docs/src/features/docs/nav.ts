export type DocsNavItem = {
  href: string;
  label: string;
  slug: string;
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};

export const docsNav: DocsNavSection[] = [
  {
    title: "Start",
    items: [
      { href: "/docs", label: "Introduction", slug: "introduction" },
      {
        href: "/docs/getting-started",
        label: "Getting started",
        slug: "getting-started",
      },
    ],
  },
  {
    title: "CLI",
    items: [
      { href: "/docs/stacks", label: "Supported stacks", slug: "stacks" },
      { href: "/docs/options", label: "Interactive options", slug: "options" },
      {
        href: "/docs/options/path",
        label: "Project path",
        slug: "options-path",
      },
      {
        href: "/docs/options/framework",
        label: "Framework",
        slug: "options-framework",
      },
      {
        href: "/docs/options/architecture",
        label: "Architecture",
        slug: "options-architecture",
      },
      {
        href: "/docs/options/linter",
        label: "Linter",
        slug: "options-linter",
      },
      {
        href: "/docs/options/typescript",
        label: "TypeScript",
        slug: "options-typescript",
      },
      {
        href: "/docs/options/react-compiler",
        label: "React Compiler",
        slug: "options-react-compiler",
      },
      {
        href: "/docs/options/store",
        label: "State store",
        slug: "options-store",
      },
      {
        href: "/docs/options/tailwind",
        label: "Tailwind CSS",
        slug: "options-tailwind",
      },
      { href: "/docs/options/i18n", label: "i18n", slug: "options-i18n" },
    ],
  },
  {
    title: "Architecture",
    items: [
      {
        href: "/docs/architecture",
        label: "Feature-first layout",
        slug: "architecture",
      },
      {
        href: "/docs/environment",
        label: "Environment variables",
        slug: "environment",
      },
    ],
  },
];

export function findDocsNavItem(pathname: string): DocsNavItem | undefined {
  for (const section of docsNav) {
    const match = section.items.find((item) => item.href === pathname);
    if (match) return match;
  }
  return undefined;
}
