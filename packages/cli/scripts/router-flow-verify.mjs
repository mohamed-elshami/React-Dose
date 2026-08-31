import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { downloadOfficialTemplate } from "../src/utils/scaffolder.js";
import { cleanDefaultTemplate } from "../src/utils/cleaner.js";
import { injectEcosystemDependencies } from "../src/utils/injector.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const playgroundDir = path.join(repoRoot, "apps/playground");

const routerMatrix = [
  {
    name: "router-ts-no-tailwind",
    project: {
      typescript: true,
      tailwind: false,
      store: "none",
      i18n: false,
    },
  },
  {
    name: "router-js-no-tailwind",
    project: {
      typescript: false,
      tailwind: false,
      store: "none",
      i18n: false,
    },
  },
  {
    name: "router-ts-tailwind",
    project: {
      typescript: true,
      tailwind: true,
      store: "none",
      i18n: false,
    },
  },
  {
    name: "router-js-tailwind",
    project: {
      typescript: false,
      tailwind: true,
      store: "none",
      i18n: false,
    },
  },
  {
    name: "router-ts-zustand",
    project: {
      typescript: true,
      tailwind: false,
      store: "zustand",
      i18n: false,
    },
  },
  {
    name: "router-ts-redux",
    project: {
      typescript: true,
      tailwind: false,
      store: "redux",
      i18n: false,
    },
  },
  {
    name: "router-ts-i18n",
    project: {
      typescript: true,
      tailwind: false,
      store: "none",
      i18n: true,
    },
  },
];

function parseArgs(argv) {
  const specIndex = argv.indexOf("--spec");
  return { spec: specIndex !== -1 ? (argv[specIndex + 1] ?? null) : null };
}

function assertExists(projectPath, relativePath) {
  if (!fs.existsSync(path.join(projectPath, relativePath))) {
    throw new Error(`Expected file to exist: ${relativePath}`);
  }
}

function assertMissing(projectPath, relativePath) {
  if (fs.existsSync(path.join(projectPath, relativePath))) {
    throw new Error(`Expected file to be absent: ${relativePath}`);
  }
}

function assertFileContains(projectPath, relativePath, needle) {
  const content = fs.readFileSync(path.join(projectPath, relativePath), "utf-8");
  if (!content.includes(needle)) {
    throw new Error(`Expected ${relativePath} to contain "${needle}"`);
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

function assertTsconfigPathAlias(projectPath) {
  const tsconfig = JSON.parse(
    fs.readFileSync(path.join(projectPath, "tsconfig.json"), "utf-8"),
  );
  const alias = tsconfig.compilerOptions?.paths?.["@/*"];

  if (!alias || !alias.includes("./src/*")) {
    throw new Error('Expected tsconfig path alias "@/*" -> "./src/*"');
  }
}

function assertRouterArchitecture(projectPath, pkg, project) {
  const rootExt = project.typescript ? "tsx" : "jsx";
  const featureExt = project.typescript ? "ts" : "js";
  const routerConfig = project.typescript
    ? "react-router.config.ts"
    : "react-router.config.js";
  const viteConfig = project.typescript ? "vite.config.ts" : "vite.config.js";

  assertExists(projectPath, `src/app/root.${rootExt}`);
  assertExists(projectPath, `src/app/routes/home.${rootExt}`);
  assertExists(projectPath, `src/app/providers/root-provider.${rootExt}`);
  assertExists(projectPath, `src/features/home/index.${featureExt}`);
  assertExists(projectPath, routerConfig);
  assertExists(projectPath, viteConfig);
  assertExists(projectPath, "tsconfig.json");

  assertMissing(projectPath, "app");
  assertMissing(projectPath, "index.html");
  assertMissing(projectPath, "src/app/welcome");
  assertMissing(projectPath, "src/app/page.tsx");
  assertMissing(projectPath, "src/app/page.jsx");
  assertMissing(projectPath, "Dockerfile");
  assertMissing(projectPath, ".agents");

  assertFileContains(projectPath, routerConfig, 'appDirectory: "src/app"');
  assertFileContains(projectPath, "package.json", "react-router dev");
  assertFileContains(projectPath, "package.json", "react-router build");
  assertFileContains(projectPath, `src/app/routes/home.${rootExt}`, "@/features/home");
  assertFileContains(
    projectPath,
    `src/app/root.${rootExt}`,
    "@/app/providers/root-provider",
  );
  assertTsconfigPathAlias(projectPath);

  assertInDeps(pkg, "react-router");
  assertInDeps(pkg, "@react-router/dev");

  if (project.tailwind) {
    assertInDeps(pkg, "tailwindcss");
    assertFileContains(projectPath, viteConfig, "tailwindcss");
  } else {
    assertNotInDeps(pkg, "tailwindcss");
    assertNotInDeps(pkg, "@tailwindcss/vite");
    const viteContent = fs.readFileSync(
      path.join(projectPath, viteConfig),
      "utf-8",
    );
    if (viteContent.includes("tailwindcss()")) {
      throw new Error(`Did not expect tailwindcss plugin in ${viteConfig}`);
    }
  }

  if (project.typescript) {
    assertFileContains(projectPath, "tsconfig.json", '"strict": true');
    assertInDeps(pkg, "typescript");
  } else {
    assertFileContains(projectPath, "tsconfig.json", '"allowJs": true');
    assertNotInDeps(pkg, "typescript");
  }

  if (project.store === "zustand") {
    assertInDeps(pkg, "zustand");
    assertExists(projectPath, `src/app/store/useCounterStore.${featureExt}`);
  }

  if (project.store === "redux") {
    assertInDeps(pkg, "@reduxjs/toolkit");
    assertInDeps(pkg, "react-redux");
    assertExists(projectPath, `src/app/store/store.${featureExt}`);
  }

  if (project.i18n) {
    assertInDeps(pkg, "i18next");
    assertInDeps(pkg, "react-i18next");
    assertExists(projectPath, `src/i18n/index.${featureExt}`);
    assertFileContains(projectPath, `src/app/root.${rootExt}`, "@/i18n");
  }
}

function buildProject(name, options) {
  return {
    path: path.join(playgroundDir, name),
    framework: "react-core",
    architectureFlavor: "router-v7",
    viteLinter: "none",
    reactCompiler: false,
    ...options,
  };
}

async function verifyRouterFlow({ name, project: options }) {
  const project = buildProject(name, options);

  console.log(`\n=== ${name} ===`);

  if (fs.existsSync(project.path)) {
    fs.rmSync(project.path, { recursive: true, force: true });
  }

  fs.mkdirSync(path.dirname(project.path), { recursive: true });

  console.log("  → downloadOfficialTemplate (create-react-router)");
  await downloadOfficialTemplate(project);

  console.log("  → cleanDefaultTemplate");
  await cleanDefaultTemplate(project);

  console.log("  → injectEcosystemDependencies");
  await injectEcosystemDependencies(project);

  const pkg = JSON.parse(
    fs.readFileSync(path.join(project.path, "package.json"), "utf-8"),
  );

  console.log("  → architecture contract checks");
  assertRouterArchitecture(project.path, pkg, project);

  console.log(`✓ ${name}`);
}

const { spec } = parseArgs(process.argv.slice(2));
const selected = spec
  ? routerMatrix.filter((entry) => entry.name === spec)
  : routerMatrix;

if (spec && selected.length === 0) {
  console.error(
    `Unknown spec "${spec}". Available: ${routerMatrix.map((c) => c.name).join(", ")}`,
  );
  process.exit(1);
}

process.chdir(repoRoot);

const failures = [];

for (const config of selected) {
  try {
    await verifyRouterFlow(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`✗ ${config.name}: ${message}`);
    failures.push({ name: config.name, message });
  }
}

console.log("\n--- summary ---");
console.log(`passed: ${selected.length - failures.length}/${selected.length}`);
console.log("mode: flow-only (no npm install / no build)");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`  - ${failure.name}: ${failure.message}`);
  }
  process.exit(1);
}

console.log("All React Router flow checks passed.");
