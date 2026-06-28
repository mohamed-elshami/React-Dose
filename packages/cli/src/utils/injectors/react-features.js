import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  copyDirectoryRecursive,
  cleanupStoresPluralDirectory,
  patchTsconfigAppPathAlias,
  stripDevDependencies,
} from "./shared.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REACT_TEMPLATES_DIR = path.resolve(__dirname, "../../../templates/react");

const LEGACY_ROUTER_ROOT_FILES = [
  "routes.ts",
  "routes.tsx",
  "routes.js",
  "routes.jsx",
  "app.config.ts",
  "app.config.js",
];

const ROOT_PROVIDER_IMPORT =
  'import { RootProvider } from "@/app/providers/root-provider";';

export function loadReactFeatureMetadata(featureName) {
  const metadataPath = path.join(
    REACT_TEMPLATES_DIR,
    featureName,
    "metadata.json",
  );

  if (!fs.existsSync(metadataPath)) {
    throw new Error(`Feature metadata not found: ${metadataPath}`);
  }

  return JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
}

function isFeatureEnabled(project, metadata) {
  const when = metadata.enabledWhen;

  if (!when || when === "always") {
    return true;
  }

  if (when === "typescript") {
    return Boolean(project.typescript);
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

  if (when.startsWith("architecture:")) {
    return project.architectureFlavor === when.slice("architecture:".length);
  }

  return false;
}

export function resolveSelectedReactFeatures(project) {
  return fs
    .readdirSync(REACT_TEMPLATES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .filter((entry) =>
      fs.existsSync(path.join(REACT_TEMPLATES_DIR, entry.name, "metadata.json")),
    )
    .map((entry) => ({
      name: entry.name,
      metadata: loadReactFeatureMetadata(entry.name),
    }))
    .filter(({ metadata }) => isFeatureEnabled(project, metadata))
    .sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99));
}

export function copyReactFeatureTemplates(featureName, isTypescript, targetDir) {
  const sourceDir = path.join(
    REACT_TEMPLATES_DIR,
    featureName,
    isTypescript ? "ts" : "js",
  );

  if (fs.existsSync(sourceDir)) {
    copyDirectoryRecursive(sourceDir, targetDir);
  }
}

export function mergeFeatureArtifacts(
  dependencies,
  devDependencies,
  devDependenciesToRemove,
  packageScriptPatches,
  metadata,
) {
  Object.assign(dependencies, metadata.dependencies ?? {});
  Object.assign(devDependencies, metadata.devDependencies ?? {});

  for (const dep of metadata.devDependenciesToRemove ?? []) {
    if (!devDependenciesToRemove.includes(dep)) {
      devDependenciesToRemove.push(dep);
    }
  }

  Object.assign(packageScriptPatches, metadata.packageScripts ?? {});
}

export function applyReactFeatureViteConfig(viteConfigData, metadata) {
  const config = metadata.vite;

  if (!config) {
    return;
  }

  if (config.replaceReactPlugin) {
    viteConfigData.imports = viteConfigData.imports.filter(
      (line) => !line.includes("@vitejs/plugin-react"),
    );
    viteConfigData.plugins = viteConfigData.plugins.filter(
      (plugin) => plugin !== "react()",
    );
  }

  for (const importLine of config.imports ?? []) {
    if (!viteConfigData.imports.includes(importLine)) {
      viteConfigData.imports.push(importLine);
    }
  }

  for (const plugin of config.prependPlugins ?? []) {
    if (!viteConfigData.plugins.includes(plugin)) {
      viteConfigData.plugins.unshift(plugin);
    }
  }

  for (const plugin of config.plugins ?? []) {
    if (!viteConfigData.plugins.includes(plugin)) {
      viteConfigData.plugins.push(plugin);
    }
  }

  if (config.usePathAlias) {
    viteConfigData.useDynamicPathAlias = true;
  }
}

function deleteFileIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function applyFeatureMetadataCleanup(targetDir, metadata) {
  if (metadata.cleanup?.cleanupStores || metadata.cleanupStores) {
    cleanupStoresPluralDirectory(targetDir);
  }

  if (metadata.cleanup?.removeLegacyRouterRootFiles) {
    for (const fileName of LEGACY_ROUTER_ROOT_FILES) {
      deleteFileIfExists(path.join(targetDir, "src", fileName));
    }
  }

  for (const relativePath of metadata.cleanup?.files ?? []) {
    deleteFileIfExists(path.join(targetDir, relativePath));
  }
}

function removeLegacyViteEntryFiles(targetDir, project) {
  const ext = project.typescript ? "tsx" : "jsx";
  const srcDir = path.join(targetDir, "src");
  const pathsToDelete = [
    path.join(srcDir, `main.${ext}`),
    path.join(srcDir, "index.css"),
    path.join(srcDir, `App.${ext}`),
  ];

  if (!project.tailwind) {
    pathsToDelete.push(path.join(srcDir, "app", "index.css"));
  }

  for (const filePath of pathsToDelete) {
    deleteFileIfExists(filePath);
  }
}

export function applyPostEntryMetadataCleanup(targetDir, project, selectedFeatures) {
  const shouldRemoveLegacyViteEntry = selectedFeatures.some(
    ({ metadata }) => metadata.cleanup?.removeLegacyViteEntry,
  );

  if (shouldRemoveLegacyViteEntry) {
    removeLegacyViteEntryFiles(targetDir, project);
  }
}

function resolveViteEntryPath(targetDir, project) {
  const ext = project.typescript ? "tsx" : "jsx";
  const isRouterV7 = project.architectureFlavor === "router-v7";

  return isRouterV7
    ? path.join(targetDir, "src", "app", `root.${ext}`)
    : path.join(targetDir, "src", "app", `main.${ext}`);
}

function resolveEntryFlavor(project) {
  return project.architectureFlavor === "router-v7" ? "router-v7" : "spa";
}

export function applyFeatureEntryHydration(targetDir, project, metadata) {
  const entryHydration = metadata.entryHydration;

  if (!entryHydration?.imports) {
    return;
  }

  const flavor = resolveEntryFlavor(project);
  const importLines =
    entryHydration.imports[flavor] ?? entryHydration.imports.spa ?? [];

  if (importLines.length === 0) {
    return;
  }

  const entryPath = resolveViteEntryPath(targetDir, project);

  if (!fs.existsSync(entryPath)) {
    return;
  }

  let content = fs.readFileSync(entryPath, "utf-8");

  for (const importLine of importLines) {
    if (!content.includes(importLine)) {
      content = `${importLine}\n${content}`;
    }
  }

  fs.writeFileSync(entryPath, content, "utf-8");
}

export function ensureRootProvider(targetDir, isTypescript) {
  const extension = isTypescript ? "tsx" : "jsx";
  const providersDir = path.join(targetDir, "src", "app", "providers");
  const rootProviderPath = path.join(providersDir, `root-provider.${extension}`);

  fs.mkdirSync(providersDir, { recursive: true });

  if (!fs.existsSync(rootProviderPath)) {
    const content = isTypescript
      ? `export function RootProvider({ children }: { children: React.ReactNode }) {\n  return <>{children}</>;\n}\n`
      : `export function RootProvider({ children }) {\n  return <>{children}</>;\n}\n`;

    fs.writeFileSync(rootProviderPath, content, "utf-8");
  }

  return rootProviderPath;
}

function ensureSpaAppStructure(targetDir, isTypescript) {
  const ext = isTypescript ? "tsx" : "jsx";
  const srcDir = path.join(targetDir, "src");
  const appDir = path.join(srcDir, "app");
  const appComponentPath = path.join(appDir, `App.${ext}`);
  const legacyAppPath = path.join(srcDir, `App.${ext}`);

  fs.mkdirSync(appDir, { recursive: true });

  if (fs.existsSync(legacyAppPath) && !fs.existsSync(appComponentPath)) {
    fs.renameSync(legacyAppPath, appComponentPath);
  } else if (!fs.existsSync(appComponentPath)) {
    fs.writeFileSync(
      appComponentPath,
      "export default function App() {\n  return null;\n}\n",
      "utf-8",
    );
  }

  const mainPath = path.join(appDir, `main.${ext}`);

  if (!fs.existsSync(mainPath)) {
    const mainContent = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RootProvider } from "@/app/providers/root-provider";
import App from "@/app/App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <RootProvider>
      <App />
    </RootProvider>
  </StrictMode>,
);
`;

    fs.writeFileSync(mainPath, mainContent, "utf-8");
  }

  const indexHtmlPath = path.join(targetDir, "index.html");

  if (fs.existsSync(indexHtmlPath)) {
    let html = fs.readFileSync(indexHtmlPath, "utf-8");
    html = html.replace(/\/src\/main\.(tsx|jsx)/, `/src/app/main.${ext}`);
    fs.writeFileSync(indexHtmlPath, html, "utf-8");
  }
}

export function injectRootProviderIntoViteEntry(targetDir, project) {
  const ext = project.typescript ? "tsx" : "jsx";

  if (project.architectureFlavor === "router-v7") {
    const rootPath = path.join(targetDir, "src", "app", `root.${ext}`);

    if (!fs.existsSync(rootPath)) {
      throw new Error(`React Router root entry file not found at ${rootPath}`);
    }

    let content = fs.readFileSync(rootPath, "utf-8");

    if (!content.includes(ROOT_PROVIDER_IMPORT)) {
      content = `${ROOT_PROVIDER_IMPORT}\n${content}`;
    }

    if (!content.includes("<RootProvider>")) {
      content = content.replace(
        /<Outlet\s*\/>/,
        "<RootProvider>\n          <Outlet />\n        </RootProvider>",
      );
    }

    fs.writeFileSync(rootPath, content, "utf-8");
    return;
  }

  ensureSpaAppStructure(targetDir, project.typescript);

  const mainPath = path.join(targetDir, "src", "app", `main.${ext}`);
  let content = fs.readFileSync(mainPath, "utf-8");

  if (!content.includes(ROOT_PROVIDER_IMPORT)) {
    content = content.replace(
      'import { createRoot } from "react-dom/client";',
      `import { createRoot } from "react-dom/client";\n${ROOT_PROVIDER_IMPORT}`,
    );
  }

  fs.writeFileSync(mainPath, content, "utf-8");
}

export function finalizeReactPackageManifest(project, pkg, frameworkResult) {
  stripDevDependencies(pkg, frameworkResult.devDependenciesToRemove ?? []);

  if (project.architectureFlavor === "router-v7") {
    for (const dep of ["@vitejs/plugin-react"]) {
      if (pkg.devDependencies?.[dep]) {
        delete pkg.devDependencies[dep];
      }
    }
  }

  if (pkg.scripts) {
    for (const [scriptName, scriptValue] of Object.entries(
      frameworkResult.packageScriptPatches ?? {},
    )) {
      if (scriptValue) {
        pkg.scripts[scriptName] = scriptValue;
      }
    }
  }

  if (
    !project.typescript &&
    project.architectureFlavor !== "router-v7" &&
    pkg.scripts?.build
  ) {
    pkg.scripts.build = "vite build";
  }
}

export function finalizeReactProjectArtifacts(project, targetDir, frameworkResult) {
  if (project.architectureFlavor === "router-v7") {
    const indexHtmlPath = path.join(targetDir, "index.html");
    const wrongConfigExtension = project.typescript
      ? "vite.config.js"
      : "vite.config.ts";
    const wrongConfigPath = path.join(targetDir, wrongConfigExtension);

    if (fs.existsSync(indexHtmlPath)) {
      fs.unlinkSync(indexHtmlPath);
    }

    if (fs.existsSync(wrongConfigPath)) {
      fs.unlinkSync(wrongConfigPath);
    }
  }

  if (project.typescript && frameworkResult.viteConfigData?.useDynamicPathAlias) {
    patchTsconfigAppPathAlias(targetDir);
  }
}
