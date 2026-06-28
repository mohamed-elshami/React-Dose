import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { copyDirectoryRecursive } from "./shared.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NEXT_TEMPLATES_DIR = path.resolve(__dirname, "../../../templates/next");

export function loadNextFeatureMetadata(featureName) {
  const metadataPath = path.join(NEXT_TEMPLATES_DIR, featureName, "metadata.json");

  if (!fs.existsSync(metadataPath)) {
    throw new Error(`Feature metadata not found: ${metadataPath}`);
  }

  return JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
}

export function resolveNextFeatureSourceDir(featureName, isTypescript) {
  return path.join(NEXT_TEMPLATES_DIR, featureName, isTypescript ? "ts" : "js");
}

function isFeatureEnabled(project, metadata) {
  const when = metadata.enabledWhen;

  if (!when || when === "always") {
    return true;
  }

  if (when === "i18n") {
    return Boolean(project.i18n);
  }

  if (when === "tailwind") {
    return Boolean(project.tailwind);
  }

  if (when.startsWith("store:")) {
    return project.store === when.slice("store:".length);
  }

  return false;
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
  metadata,
) {
  Object.assign(dependencies, metadata.dependencies ?? {});
  Object.assign(devDependencies, metadata.devDependencies ?? {});
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
  const providerFeatures = selectedFeatures
    .map(({ metadata }) => metadata)
    .filter((metadata) => metadata.providerWrapper);

  if (providerFeatures.length === 0) {
    return;
  }

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

  content = content.replace(
    /<body([^>]*)>\s*\{children\}\s*<\/body>/,
    `<body$1>\n        ${providerOpen}\n          {children}\n        </RootProvider>\n      </body>`,
  );

  fs.writeFileSync(layoutPath, content, "utf-8");
}
