import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHARED_TEMPLATES_DIR = path.resolve(__dirname, "../../../templates/shared");

function stripJsonComments(json) {
  return json
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/,(\s*[}\]])/g, "$1");
}

export function patchTsconfigAppPathAlias(targetDir) {
  const tsconfigPath = path.join(targetDir, "tsconfig.app.json");

  if (!fs.existsSync(tsconfigPath)) {
    return;
  }

  let content = fs.readFileSync(tsconfigPath, "utf-8");

  if (content.includes('"@/*"')) {
    if (!content.includes('"ignoreDeprecations"')) {
      const tsconfig = JSON.parse(stripJsonComments(content));
      tsconfig.compilerOptions = {
        ...tsconfig.compilerOptions,
        ignoreDeprecations: "6.0",
      };

      fs.writeFileSync(
        tsconfigPath,
        `${JSON.stringify(tsconfig, null, 2)}\n`,
        "utf-8",
      );
    }
    return;
  }

  const aliasBlock = `    "baseUrl": ".",
    "ignoreDeprecations": "6.0",
    "paths": {
      "@/*": ["./src/*"]
    }`;

  const patched = content.replace(
    /("compilerOptions"\s*:\s*\{)([\s\S]*?)(\r?\n  \}),(\r?\n  "include")/,
    (_, open, body, close, include) => {
      const trimmed = body.replace(/\s+$/, "");
      const suffix = trimmed.endsWith(",") ? "" : ",";
      return `${open}${body}${suffix}\n${aliasBlock}${close},${include}`;
    },
  );

  if (patched !== content) {
    fs.writeFileSync(tsconfigPath, patched, "utf-8");
    return;
  }

  const tsconfig = JSON.parse(stripJsonComments(content));
  tsconfig.compilerOptions = {
    ...tsconfig.compilerOptions,
    baseUrl: ".",
    ignoreDeprecations: "6.0",
    paths: {
      ...(tsconfig.compilerOptions?.paths ?? {}),
      "@/*": ["./src/*"],
    },
  };

  fs.writeFileSync(
    tsconfigPath,
    `${JSON.stringify(tsconfig, null, 2)}\n`,
    "utf-8",
  );
}

export function stripDevDependencies(pkg, depsToRemove = []) {
  if (!pkg.devDependencies || depsToRemove.length === 0) return pkg;

  for (const dep of depsToRemove) {
    if (pkg.devDependencies[dep]) {
      delete pkg.devDependencies[dep];
    }
  }

  return pkg;
}

export function cleanupStoresPluralDirectory(targetDir) {
  const storesDir = path.join(targetDir, "src", "app", "store", "stores");

  if (fs.existsSync(storesDir)) {
    fs.rmSync(storesDir, { recursive: true, force: true });
  }
}

export function copySharedTemplates(isTypescript, targetDir) {
  const sourceDir = path.join(SHARED_TEMPLATES_DIR, isTypescript ? "ts" : "js");

  if (fs.existsSync(sourceDir)) {
    copyDirectoryRecursive(sourceDir, targetDir);
  }
}

export function copyDirectoryRecursive(source, destination) {
  if (!fs.existsSync(source)) {
    throw new Error(`Template source not found: ${source}`);
  }

  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

export function buildBaseEcosystemDependencies(
  project,
  existingDevDependencies = {},
) {
  const dependencies = {};
  const devDependencies = {};

  if (project.typescript && project.framework === "react-core") {
    if (!existingDevDependencies["@types/react"]) {
      devDependencies["@types/react"] = "^19.0.0";
    }
    if (!existingDevDependencies["@types/react-dom"]) {
      devDependencies["@types/react-dom"] = "^19.0.0";
    }
  }

  return { dependencies, devDependencies };
}

export function sortDependencies(pkg) {
  if (pkg.dependencies) {
    pkg.dependencies = Object.fromEntries(
      Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)),
    );
  }

  if (pkg.devDependencies) {
    pkg.devDependencies = Object.fromEntries(
      Object.entries(pkg.devDependencies).sort(([a], [b]) =>
        a.localeCompare(b),
      ),
    );
  }

  return pkg;
}
