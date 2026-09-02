import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { downloadOfficialTemplate } from "../src/utils/scaffolder.js";
import { cleanDefaultTemplate } from "../src/utils/cleaner.js";
import { injectEcosystemDependencies } from "../src/utils/injector.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const playgroundDir = path.join(repoRoot, "apps/playground");

const presets = {
  vite: {
    name: "vite-ts",
    project: {
      framework: "react-core",
      architectureFlavor: "spa",
      typescript: true,
      viteLinter: "eslint",
      store: "none",
      tailwind: true,
      i18n: false,
      reactCompiler: false,
    },
  },
  router: {
    name: "router-ts",
    project: {
      framework: "react-core",
      architectureFlavor: "router-v7",
      typescript: true,
      viteLinter: "none",
      store: "none",
      tailwind: true,
      i18n: false,
      reactCompiler: false,
    },
  },
  next: {
    name: "next-ts",
    project: {
      framework: "next-core",
      architectureFlavor: "none",
      typescript: true,
      store: "none",
      tailwind: true,
      i18n: false,
      reactCompiler: false,
    },
  },
};

async function scaffoldPreset({ name, project: baseProject }) {
  const projectPath = path.join(playgroundDir, name);
  const project = { ...baseProject, path: projectPath };

  if (fs.existsSync(projectPath)) {
    fs.rmSync(projectPath, { recursive: true, force: true });
  }

  fs.mkdirSync(playgroundDir, { recursive: true });

  await downloadOfficialTemplate(project);
  await cleanDefaultTemplate(project);
  await injectEcosystemDependencies(project);

  console.log(`Scaffolded ${name}`);
  return projectPath;
}

function installAndBuild(projectPath) {
  console.log(`Installing dependencies for ${projectPath}...`);
  execSync("npm install", { cwd: projectPath, stdio: "inherit", env: { ...process.env, CI: "1" } });

  console.log(`Building ${projectPath}...`);
  execSync("npm run build", { cwd: projectPath, stdio: "inherit", env: { ...process.env, CI: "1" } });
}

const selected = process.argv.slice(2);
const toRun =
  selected.length > 0
    ? selected.map((key) => presets[key]).filter(Boolean)
    : Object.values(presets);

if (selected.length > 0 && toRun.length !== selected.length) {
  const unknown = selected.filter((key) => !presets[key]);
  console.error(`Unknown preset(s): ${unknown.join(", ")}`);
  console.error(`Available: ${Object.keys(presets).join(", ")}`);
  process.exit(1);
}

process.chdir(repoRoot);
process.env.CI = "1";

for (const preset of toRun) {
  const projectPath = await scaffoldPreset(preset);
  installAndBuild(projectPath);
  console.log(`✓ ${preset.name} ready\n`);
}

console.log("All playground projects scaffolded and built.");
