import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { copyDirectoryRecursive } from "./shared.js";
import {
  isFeatureEnabled,
  validateFeatureMetadata,
} from "../features/feature-engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NEXT_TEMPLATES_DIR = path.resolve(__dirname, "../../../templates/next");

export function loadNextFeatureMetadata(featureName) {
  const metadataPath = path.join(NEXT_TEMPLATES_DIR, featureName, "metadata.json");

  if (!fs.existsSync(metadataPath)) {
    throw new Error(`Feature metadata not found: ${metadataPath}`);
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  return validateFeatureMetadata(metadata, metadataPath);
}

export function resolveNextFeatureSourceDir(featureName, isTypescript) {
  return path.join(NEXT_TEMPLATES_DIR, featureName, isTypescript ? "ts" : "js");
}

export function discoverNextFeatureNames() {
  return fs
    .readdirSync(NEXT_TEMPLATES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .filter((entry) =>
      fs.existsSync(path.join(NEXT_TEMPLATES_DIR, entry.name, "metadata.json")),
    )
    .map((entry) => entry.name);
}

export function resolveSelectedNextFeatures(project) {
  return discoverNextFeatureNames()
    .map((name) => ({ name, metadata: loadNextFeatureMetadata(name) }))
    .filter(({ metadata }) => isFeatureEnabled(project, metadata))
    .sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99));
}

export function mergeFeatureDependencies(
  dependencies,
  devDependencies,
  devDependenciesToRemove,
  metadata,
) {
  Object.assign(dependencies, metadata.dependencies ?? {});
  Object.assign(devDependencies, metadata.devDependencies ?? {});

  for (const dep of metadata.devDependenciesToRemove ?? []) {
    if (!devDependenciesToRemove.includes(dep)) {
      devDependenciesToRemove.push(dep);
    }
  }
}

export function copyNextFeatureTemplates(featureName, isTypescript, targetDir) {
  const sourceDir = resolveNextFeatureSourceDir(featureName, isTypescript);
  copyDirectoryRecursive(sourceDir, targetDir);
}

export function ensureRootProvider(targetDir, isTypescript) {
  const extension = isTypescript ? "tsx" : "jsx";
  const providersDir = path.join(targetDir, "src", "app", "providers");
  const providerPath = path.join(providersDir, `root-provider.${extension}`);

  fs.mkdirSync(providersDir, { recursive: true });

  if (!fs.existsSync(providerPath)) {
    const content = isTypescript
      ? `"use client";

export default function RootProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`
      : `"use client";

export default function RootProvider({ children }) {
  return <>{children}</>;
}
`;

    fs.writeFileSync(providerPath, content, "utf-8");
  }

  return providerPath;
}

function resolveLayoutPath(targetDir, isTypescript) {
  const appDir = path.join(targetDir, "src", "app");
  const candidates = isTypescript
    ? ["layout.tsx"]
    : ["layout.js", "layout.jsx", "layout.tsx"];

  for (const fileName of candidates) {
    const layoutPath = path.join(appDir, fileName);

    if (fs.existsSync(layoutPath)) {
      return layoutPath;
    }
  }

  return null;
}

function resolveLocaleLayoutPath(targetDir, isTypescript) {
  const localeDir = path.join(targetDir, "src", "app", "[locale]");
  const candidates = isTypescript
    ? ["layout.tsx"]
    : ["layout.js", "layout.jsx", "layout.tsx"];

  for (const fileName of candidates) {
    const layoutPath = path.join(localeDir, fileName);

    if (fs.existsSync(layoutPath)) {
      return layoutPath;
    }
  }

  return null;
}

export function injectRootProviderIntoLayout(
  targetDir,
  project,
  selectedFeatures,
) {
  const useLocaleLayout = selectedFeatures.some(
    ({ metadata }) => metadata.layoutTarget === "locale",
  );
  const layoutPath = useLocaleLayout
    ? resolveLocaleLayoutPath(targetDir, project.typescript)
    : resolveLayoutPath(targetDir, project.typescript);

  if (!layoutPath) {
    return;
  }

  let content = fs.readFileSync(layoutPath, "utf-8");
  const importLine =
    'import RootProvider from "@/app/providers/root-provider";';

  if (!content.includes(importLine)) {
    content = `${importLine}\n${content}`;
  }

  if (content.includes("<RootProvider")) {
    fs.writeFileSync(layoutPath, content, "utf-8");
    return;
  }

  const layoutProps = selectedFeatures
    .map(({ metadata }) => metadata.layoutProviderProps)
    .filter(Boolean)
    .join(" ");
  const providerOpen = layoutProps
    ? `<RootProvider ${layoutProps}>`
    : "<RootProvider>";

  if (!/<body([^>]*)>\s*\{children\}\s*<\/body>/.test(content)) {
    throw new Error(
      `Could not inject RootProvider into layout at ${layoutPath}: expected "<body>{children}</body>" structure was not found.`,
    );
  }

  content = content.replace(
    /<body([^>]*)>\s*\{children\}\s*<\/body>/,
    `<body$1>\n        ${providerOpen}\n          {children}\n        </RootProvider>\n      </body>`,
  );

  fs.writeFileSync(layoutPath, content, "utf-8");
}

function patchNextGlobalsCss(targetDir) {
  const globalsPath = path.join(targetDir, "src", "app", "globals.css");

  if (!fs.existsSync(globalsPath)) {
    return;
  }

  const content = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
}
`;

  fs.writeFileSync(globalsPath, content, "utf-8");
}

function writeDefaultNextLayout(targetDir, project) {
  const layoutPath = path.join(
    targetDir,
    "src",
    "app",
    project.typescript ? "layout.tsx" : "layout.jsx",
  );

  const content = project.typescript
    ? `import type { Metadata } from "next";
import RootProvider from "@/app/providers/root-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Dose",
  description: "Feature-first React ecosystem scaffolded with React Dose CLI.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
`
    : `import RootProvider from "@/app/providers/root-provider";
import "./globals.css";

export const metadata = {
  title: "React Dose",
  description: "Feature-first React ecosystem scaffolded with React Dose CLI.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
`;

  fs.writeFileSync(layoutPath, content, "utf-8");
}

export function finalizeNextAppShell(project, targetDir, selectedFeatures) {
  const hasI18n = selectedFeatures.some(({ name }) => name === "i18n");

  if (project.tailwind) {
    patchNextGlobalsCss(targetDir);
  }

  if (hasI18n) {
    injectRootProviderIntoLayout(targetDir, project, selectedFeatures);
    return;
  }

  writeDefaultNextLayout(targetDir, project);
}
