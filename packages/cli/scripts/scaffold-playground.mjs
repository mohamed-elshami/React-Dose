import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { downloadOfficialTemplate } from "../src/utils/scaffolder.js";
import { cleanDefaultTemplate } from "../src/utils/cleaner.js";
import { injectEcosystemDependencies } from "../src/utils/injector.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const appName = process.argv[2] ?? "vite-ts";
const projectPath = path.join(repoRoot, "apps/playground", appName);

const project = {
  path: projectPath,
  framework: "react-core",
  architectureFlavor: "spa",
  typescript: true,
  viteLinter: "eslint",
  store: "none",
  tailwind: true,
  i18n: false,
  reactCompiler: false,
};

process.chdir(repoRoot);
process.env.CI = "1";

if (fs.existsSync(projectPath)) {
  fs.rmSync(projectPath, { recursive: true, force: true });
}

fs.mkdirSync(path.dirname(projectPath), { recursive: true });

await downloadOfficialTemplate(project);
await cleanDefaultTemplate(project);
await injectEcosystemDependencies(project);

console.log(`Scaffolded React Vite app at apps/playground/${appName}`);
