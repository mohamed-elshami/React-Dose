import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { downloadOfficialTemplate } from "../src/utils/scaffolder.js";
import { cleanDefaultTemplate } from "../src/utils/cleaner.js";
import { injectEcosystemDependencies } from "../src/utils/injector.js";

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
      store: "none",
      tailwind: false,
      i18n: false,
      reactCompiler: true,
    },
  },
  {
    name: "verify-vite-spa-ts",
    project: {
      path: path.join(playgroundDir, "verify-vite-spa-ts"),
      framework: "react-core",
      architectureFlavor: "spa",
      typescript: true,
      store: "none",
      tailwind: false,
      i18n: false,
      reactCompiler: false,
    },
  },
  {
    name: "verify-vite-router-ts",
    project: {
      path: path.join(playgroundDir, "verify-vite-router-ts"),
      framework: "react-core",
      architectureFlavor: "router-v7",
      typescript: true,
      store: "none",
      tailwind: false,
      i18n: false,
      reactCompiler: false,
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
  },
];

process.chdir(repoRoot);

for (const { name, project } of configs) {
  console.log(`\n=== Scaffolding ${name} ===`);

  if (fs.existsSync(project.path)) {
    fs.rmSync(project.path, { recursive: true, force: true });
  }

  fs.mkdirSync(path.dirname(project.path), { recursive: true });

  await downloadOfficialTemplate(project);
  await cleanDefaultTemplate(project);
  await injectEcosystemDependencies(project);

  console.log(`Scaffolded: ${project.path}`);
}
