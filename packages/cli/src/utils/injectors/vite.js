import fs from "fs";
import path from "path";
import {
  resolveSelectedReactFeatures,
  copyReactFeatureTemplates,
  mergeFeatureArtifacts,
  applyReactFeatureViteConfig,
  applyFeatureMetadataCleanup,
  ensureRootProvider,
  applyFeatureEntryHydration,
  injectRootProviderIntoViteEntry,
  applyPostEntryMetadataCleanup,
  finalizeReactPackageManifest,
  finalizeReactProjectArtifacts,
} from "./react-features.js";
import { injectProvidersFromMetadata } from "./provider-injection.js";
import { copySharedTemplates } from "./shared.js";

function buildViteConfigContent(viteConfigData) {
  const pathAliasImports = viteConfigData.useDynamicPathAlias
    ? ['import path from "path";', 'import { fileURLToPath } from "url";']
    : [];

  const imports = [...pathAliasImports, ...viteConfigData.imports].join("\n");
  const plugins = viteConfigData.plugins.join(", ");

  const dirnameBlock = viteConfigData.useDynamicPathAlias
    ? `\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);\n`
    : "";

  const resolveBlock = viteConfigData.useDynamicPathAlias
    ? `  resolve: {\n    alias: {\n      "@": path.resolve(__dirname, "./src"),\n    },\n  },\n`
    : "";

  return `${imports}${dirnameBlock}\nexport default defineConfig({\n  plugins: [${plugins}],\n${resolveBlock}});\n`;
}

function writeViteConfig(project, targetDir, viteConfigData) {
  const extension = project.typescript ? "ts" : "js";
  const configPath = path.join(targetDir, `vite.config.${extension}`);
  fs.writeFileSync(configPath, buildViteConfigContent(viteConfigData), "utf-8");
}

/**
 * Central Vite ecosystem processor — metadata-driven feature orchestration.
 */
export async function processViteEcosystem(project, targetDir, pkg) {
  const dependencies = {};
  const devDependencies = {};
  const devDependenciesToRemove = [];
  const viteConfigData = {
    imports: [
      'import { defineConfig } from "vite";',
      'import react from "@vitejs/plugin-react";',
    ],
    plugins: ["react()"],
    useDynamicPathAlias: false,
  };
  const packageScriptPatches = {};

  const selectedFeatures = resolveSelectedReactFeatures(project);
  const providerMetadata = [];

  for (const { name, metadata } of selectedFeatures) {
    copyReactFeatureTemplates(name, project.typescript, targetDir);
    mergeFeatureArtifacts(
      dependencies,
      devDependencies,
      devDependenciesToRemove,
      packageScriptPatches,
      metadata,
    );
    applyReactFeatureViteConfig(viteConfigData, metadata);
    applyFeatureMetadataCleanup(targetDir, metadata);

    if (metadata.providerWrapper) {
      providerMetadata.push(metadata);
    }
  }

  copySharedTemplates(project.typescript, targetDir);

  if (!project.tailwind) {
    devDependenciesToRemove.push("tailwindcss", "@tailwindcss/vite");
  }

  if (project.architectureFlavor !== "router-v7") {
    injectRootProviderIntoViteEntry(targetDir, project);
  }

  const providerPath = ensureRootProvider(targetDir, project.typescript);
  injectProvidersFromMetadata(providerPath, providerMetadata);

  for (const { metadata } of selectedFeatures) {
    applyFeatureEntryHydration(targetDir, project, metadata);
  }

  if (project.architectureFlavor === "router-v7") {
    injectRootProviderIntoViteEntry(targetDir, project);
  }

  applyPostEntryMetadataCleanup(targetDir, project, selectedFeatures);

  writeViteConfig(project, targetDir, viteConfigData);

  const frameworkResult = {
    dependencies,
    devDependencies,
    devDependenciesToRemove,
    viteConfigData,
    packageScriptPatches,
  };

  if (pkg) {
    finalizeReactPackageManifest(project, pkg, frameworkResult);
  }

  finalizeReactProjectArtifacts(project, targetDir, frameworkResult);

  return frameworkResult;
}
