import fs from "fs";
import path from "path";
import { stripDevDependencies, copySharedTemplates } from "./shared.js";
import { injectProvidersFromMetadata } from "./provider-injection.js";
import { applyFeatureMetadataCleanup } from "./react-features.js";
import {
  resolveSelectedNextFeatures,
  mergeFeatureDependencies,
  copyNextFeatureTemplates,
  ensureRootProvider,
  injectRootProviderIntoLayout,
} from "./next-features.js";

/**
 * Strict Next.js cleanup — removes conflicting config files for the chosen language.
 */
export function cleanupDefaultNextArtifacts(targetDir, isTypescript) {
  const wrongConfigExtension = isTypescript
    ? "next.config.mjs"
    : "next.config.ts";
  const wrongConfigPath = path.join(targetDir, wrongConfigExtension);

  if (fs.existsSync(wrongConfigPath)) {
    fs.unlinkSync(wrongConfigPath);
  }
}

function cleanupScaffoldedTailwind(targetDir) {
  const postcssPath = path.join(targetDir, "postcss.config.mjs");

  if (fs.existsSync(postcssPath)) {
    fs.unlinkSync(postcssPath);
  }
}

function removeReactCompilerFromNextConfig(targetDir, project) {
  if (project.reactCompiler) {
    return;
  }

  const extension = project.typescript ? "ts" : "mjs";
  const configPath = path.join(targetDir, `next.config.${extension}`);

  if (!fs.existsSync(configPath)) {
    return;
  }

  let content = fs.readFileSync(configPath, "utf-8");

  if (!/reactCompiler:\s*true/.test(content)) {
    return;
  }

  content = content.replace(/\s*reactCompiler:\s*true,\n?/, "");
  fs.writeFileSync(configPath, content, "utf-8");
}

function writeDefaultNextConfig(targetDir, project) {
  const extension = project.typescript ? "ts" : "mjs";
  const configPath = path.join(targetDir, `next.config.${extension}`);
  const reactCompilerLine = project.reactCompiler
    ? "\n  reactCompiler: true,"
    : "";

  const content = project.typescript
    ? `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,${reactCompilerLine}
};

export default nextConfig;
`
    : `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,${reactCompilerLine}
};

export default nextConfig;
`;

  fs.writeFileSync(configPath, content, "utf-8");
  cleanupDefaultNextArtifacts(targetDir, project.typescript);
}

function finalizeNextPackageManifest(pkg, frameworkResult) {
  stripDevDependencies(pkg, frameworkResult.devDependenciesToRemove ?? []);
}

/**
 * Central Next.js ecosystem processor — metadata-driven feature orchestration.
 */
export async function processNextEcosystem(project, targetDir, pkg) {
  const dependencies = {};
  const devDependencies = {};
  const devDependenciesToRemove = [];
  const selectedFeatures = resolveSelectedNextFeatures(project);
  const providerMetadata = [];

  for (const { name, metadata } of selectedFeatures) {
    copyNextFeatureTemplates(name, project.typescript, targetDir);
    mergeFeatureDependencies(dependencies, devDependencies, metadata);
    applyFeatureMetadataCleanup(targetDir, metadata);

    if (metadata.providerWrapper) {
      providerMetadata.push(metadata);
    }
  }

  copySharedTemplates(project.typescript, targetDir);

  if (!project.tailwind) {
    devDependenciesToRemove.push("tailwindcss", "@tailwindcss/postcss");
    cleanupScaffoldedTailwind(targetDir);
  }

  const providerPath = ensureRootProvider(targetDir, project.typescript);
  injectProvidersFromMetadata(providerPath, providerMetadata, {
    isTypescript: project.typescript,
    useClientDirective: true,
  });

  if (providerMetadata.length > 0) {
    injectRootProviderIntoLayout(targetDir, project, selectedFeatures);
  }

  const hasI18nNextConfig = selectedFeatures.some(
    ({ metadata }) => metadata.nextConfig,
  );

  if (hasI18nNextConfig) {
    cleanupDefaultNextArtifacts(targetDir, project.typescript);
    removeReactCompilerFromNextConfig(targetDir, project);
  } else {
    writeDefaultNextConfig(targetDir, project);
  }

  const frameworkResult = {
    dependencies,
    devDependencies,
    devDependenciesToRemove,
    viteConfigData: null,
    packageScriptPatches: {},
  };

  if (pkg) {
    finalizeNextPackageManifest(pkg, frameworkResult);
  }

  return frameworkResult;
}
