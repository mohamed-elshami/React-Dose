import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { downloadOfficialTemplate } from "../src/utils/scaffolder.js";
import { cleanDefaultTemplate } from "../src/utils/cleaner.js";
import { injectEcosystemDependencies } from "../src/utils/injector.js";

const execPromise = promisify(exec);
const execEnv = { ...process.env, FORCE_COLOR: "1", CI: "1" };

process.setMaxListeners(20);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const playgroundDir = path.join(repoRoot, "apps/playground");

const configs = [
  {
    name: "verify-vite-spa-compiler-ts",
    project: {
      path: path.join(playgroundDir, "verify-vite-spa-compiler-ts"),
      framework: "react-core",
      architectureFlavor: "spa",
      typescript: true,
      viteLinter: "eslint",
      store: "none",
      tailwind: false,
      i18n: false,
      reactCompiler: true,
    },
    assert(projectPath, pkg) {
      assertExists(projectPath, "src/features/home/index.ts");
      assertExists(projectPath, "src/app/providers/root-provider.tsx");
      assertExists(projectPath, "src/app/main.tsx");
      assertMissing(projectPath, "src/app/page.tsx");
      assertMissing(projectPath, "src/app/page.jsx");
      assertExists(projectPath, "eslint.config.js");
      assertMissing(projectPath, ".oxlintrc.json");
      assertFileContains(projectPath, "vite.config.ts", "reactCompilerPreset");
      assertNotInDeps(pkg, "zustand");
      assertNotInDeps(pkg, "@reduxjs/toolkit");
    },
  },
  {
    name: "verify-vite-spa-ts",
    project: {
      path: path.join(playgroundDir, "verify-vite-spa-ts"),
      framework: "react-core",
      architectureFlavor: "spa",
      typescript: true,
      viteLinter: "eslint",
      store: "none",
      tailwind: false,
      i18n: false,
      reactCompiler: false,
    },
    assert(projectPath, pkg) {
      assertExists(projectPath, "src/features/home/index.ts");
      assertExists(projectPath, "src/app/App.tsx");
      assertExists(projectPath, "src/features/home/CreatorLinks.tsx");
      assertExists(projectPath, "src/features/home/creatorLinks.data.ts");
      assertMissing(projectPath, "src/app/page.tsx");
      assertMissing(projectPath, "src/app/page.jsx");
      assertExists(projectPath, "eslint.config.js");
      assertMissing(projectPath, ".oxlintrc.json");
      assertNotInDeps(pkg, "zustand");
    },
  },
  {
    name: "verify-vite-router-ts",
    project: {
      path: path.join(playgroundDir, "verify-vite-router-ts"),
      framework: "react-core",
      architectureFlavor: "router-v7",
      typescript: true,
      viteLinter: "none",
      store: "none",
      tailwind: false,
      i18n: false,
      reactCompiler: false,
    },
    assert(projectPath, pkg) {
      assertExists(projectPath, "src/app/root.tsx");
      assertExists(projectPath, "src/app/providers/root-provider.tsx");
      assertExists(projectPath, "src/app/routes/home.tsx");
      assertExists(projectPath, "src/features/home/index.ts");
      assertMissing(projectPath, "app");
      assertMissing(projectPath, "index.html");
      assertMissing(projectPath, "src/app/welcome");
      assertFileContains(projectPath, "react-router.config.ts", "appDirectory");
      assertFileContains(projectPath, "package.json", "react-router dev");
      assertNotInDeps(pkg, "tailwindcss");
      assertNotInDeps(pkg, "zustand");
    },
  },
  {
    name: "verify-vite-router-js",
    project: {
      path: path.join(playgroundDir, "verify-vite-router-js"),
      framework: "react-core",
      architectureFlavor: "router-v7",
      typescript: false,
      viteLinter: "none",
      store: "none",
      tailwind: false,
      i18n: false,
      reactCompiler: false,
    },
    assert(projectPath, pkg) {
      assertExists(projectPath, "src/app/root.jsx");
      assertExists(projectPath, "src/app/providers/root-provider.jsx");
      assertExists(projectPath, "src/features/home/index.js");
      assertMissing(projectPath, "app");
      assertFileContains(projectPath, "react-router.config.js", "appDirectory");
      assertFileContains(projectPath, "tsconfig.json", "\"allowJs\": true");
      assertNotInDeps(pkg, "tailwindcss");
      assertNotInDeps(pkg, "typescript");
    },
  },
  {
    name: "verify-next-ts",
    project: {
      path: path.join(playgroundDir, "verify-next-ts"),
      framework: "next-core",
      architectureFlavor: "none",
      typescript: true,
      store: "none",
      tailwind: false,
      i18n: false,
      reactCompiler: false,
    },
    assert(projectPath, pkg) {
      assertExists(projectPath, "src/features/home/index.ts");
      assertExists(projectPath, "src/app/layout.tsx");
      assertExists(projectPath, "public/favicon.ico");
      assertMissing(projectPath, "src/app/favicon.ico");
      assertExists(projectPath, "next.config.ts");
      assertMissing(projectPath, "src/app/[locale]");
      assertNotInDeps(pkg, "next-intl");
    },
  },
  {
    name: "verify-next-i18n-ts",
    project: {
      path: path.join(playgroundDir, "verify-next-i18n-ts"),
      framework: "next-core",
      architectureFlavor: "none",
      typescript: true,
      store: "none",
      tailwind: false,
      i18n: true,
      reactCompiler: false,
    },
    assert(projectPath, pkg) {
      assertExists(projectPath, "src/app/[locale]/layout.tsx");
      assertExists(projectPath, "messages/en.json");
      assertInDeps(pkg, "next-intl");
    },
  },
];

function parseArgs(argv) {
  const specIndex = argv.indexOf("--spec");
  if (specIndex !== -1) {
    return { spec: argv[specIndex + 1] ?? null };
  }
  return { spec: null };
}

function assertExists(projectPath, relativePath) {
  const fullPath = path.join(projectPath, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Expected file to exist: ${relativePath}`);
  }
}

function assertMissing(projectPath, relativePath) {
  const fullPath = path.join(projectPath, relativePath);
  if (fs.existsSync(fullPath)) {
    throw new Error(`Expected file to be absent: ${relativePath}`);
  }
}

function assertFileContains(projectPath, relativePath, needle) {
  const fullPath = path.join(projectPath, relativePath);
  const content = fs.readFileSync(fullPath, "utf-8");
  if (!content.includes(needle)) {
    throw new Error(
      `Expected ${relativePath} to contain "${needle}"`,
    );
  }
}

function assertInDeps(pkg, depName) {
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  if (!all[depName]) {
    throw new Error(`Expected dependency "${depName}" in package.json`);
  }
}

function assertNotInDeps(pkg, depName) {
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  if (all[depName]) {
    throw new Error(`Did not expect dependency "${depName}" in package.json`);
  }
}

async function runCommand(command, cwd, label) {
  console.log(`  → ${label}`);
  await execPromise(command, {
    cwd,
    env: execEnv,
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function verifyConfig({ name, project, assert }) {
  console.log(`\n=== ${name} ===`);

  if (fs.existsSync(project.path)) {
    fs.rmSync(project.path, { recursive: true, force: true });
  }

  fs.mkdirSync(path.dirname(project.path), { recursive: true });

  await downloadOfficialTemplate(project);
  await cleanDefaultTemplate(project);
  await injectEcosystemDependencies(project);

  const packageJsonPath = path.join(project.path, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  console.log("  → contract checks");
  assert(project.path, pkg);

  await runCommand("npm install", project.path, "npm install");
  await runCommand("npm run build", project.path, "npm run build");

  if (pkg.scripts?.lint && project.framework === "react-core") {
    await runCommand("npm run lint", project.path, "npm run lint");
  }

  console.log(`✓ ${name}`);
}

const { spec } = parseArgs(process.argv.slice(2));
const selected = spec
  ? configs.filter((entry) => entry.name === spec)
  : configs;

if (spec && selected.length === 0) {
  console.error(`Unknown spec "${spec}". Available: ${configs.map((c) => c.name).join(", ")}`);
  process.exit(1);
}

process.chdir(repoRoot);

const failures = [];

for (const config of selected) {
  try {
    await verifyConfig(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`✗ ${config.name}: ${message}`);
    failures.push({ name: config.name, message });
  }
}

console.log("\n--- summary ---");
console.log(`passed: ${selected.length - failures.length}/${selected.length}`);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`  - ${failure.name}: ${failure.message}`);
  }
  process.exit(1);
}

console.log("All scaffold verify checks passed.");
