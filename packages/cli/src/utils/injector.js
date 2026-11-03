import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
  buildBaseEcosystemDependencies,
  sortDependencies,
} from "./injectors/shared.js";
import { processViteEcosystem } from "./injectors/vite.js";
import { processNextEcosystem } from "./injectors/next.js";
import { finalizeProjectPolish } from "./injectors/project-polish.js";

const pinsPath = fileURLToPath(new URL("./scaffold-pins.json", import.meta.url));
const scaffoldPins = JSON.parse(fs.readFileSync(pinsPath, "utf-8"));

function repairNextOfficialVersions(pkg) {
  const nextRange = `^${scaffoldPins.createNextApp}.0.0`;

  if (pkg.dependencies?.next) {
    pkg.dependencies.next = nextRange;
  }

  if (pkg.devDependencies?.["eslint-config-next"]) {
    pkg.devDependencies["eslint-config-next"] = nextRange;
  }
}

function stripIgnoreDeprecationsFromTsconfigs(targetDir) {
  for (const fileName of ["tsconfig.app.json", "tsconfig.node.json", "tsconfig.json"]) {
    const filePath = path.join(targetDir, fileName);
    if (!fs.existsSync(filePath)) continue;

    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.includes("ignoreDeprecations")) continue;

    const stripped = raw
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .replace(/,(\s*[}\]])/g, "$1");
    const tsconfig = JSON.parse(stripped);

    if (tsconfig.compilerOptions?.ignoreDeprecations) {
      delete tsconfig.compilerOptions.ignoreDeprecations;
      fs.writeFileSync(filePath, `${JSON.stringify(tsconfig, null, 2)}\n`, "utf-8");
    }
  }
}

/**
 * Official Vite react-ts templates may ship TypeScript 7 while
 * typescript-eslint@8 still peers typescript <6.1 — pin a compatible TS
 * and drop TS 6+ only compiler flags.
 */
function repairViteTypescriptEslintCompat(pkg, project, targetDir) {
  if (project.framework !== "react-core" || !project.typescript) {
    return;
  }

  const hasTsEslint = Boolean(pkg.devDependencies?.["typescript-eslint"]);
  const typescriptRange = pkg.devDependencies?.typescript;

  if (!hasTsEslint || !typescriptRange) {
    return;
  }

  if (/^[~^]?[67]\./.test(typescriptRange) || typescriptRange === "latest") {
    pkg.devDependencies.typescript = "~5.9.0";
    stripIgnoreDeprecationsFromTsconfigs(targetDir);
  }
}

export async function injectEcosystemDependencies(project) {
  const s = p.spinner();
  const msg =
    "Injecting the React Dose secret sauce & architecture layers... 🧪";

  s.start(pc.dim(msg));

  const targetDir = path.resolve(project.path);
  const packageJsonPath = path.join(targetDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    s.stop(pc.red(msg));
    throw new Error(`package.json not found at ${packageJsonPath}`);
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const baseDeps = buildBaseEcosystemDependencies(project, pkg.devDependencies);

    let frameworkDeps = {
      dependencies: {},
      devDependencies: {},
      devDependenciesToRemove: [],
    };

    if (project.framework === "react-core") {
      frameworkDeps = await processViteEcosystem(project, targetDir, pkg);
      repairViteTypescriptEslintCompat(pkg, project, targetDir);
    } else if (project.framework === "next-core") {
      frameworkDeps = await processNextEcosystem(project, targetDir, pkg);
      repairNextOfficialVersions(pkg);
    }

    pkg.dependencies = {
      ...(pkg.dependencies ?? {}),
      ...baseDeps.dependencies,
      ...frameworkDeps.dependencies,
    };
    pkg.devDependencies = {
      ...(pkg.devDependencies ?? {}),
      ...baseDeps.devDependencies,
      ...frameworkDeps.devDependencies,
    };

    finalizeProjectPolish(project, targetDir, pkg);

    fs.writeFileSync(
      packageJsonPath,
      `${JSON.stringify(sortDependencies(pkg), null, 2)}\n`,
      "utf-8",
    );

    s.stop(pc.green(msg));
  } catch (error) {
    s.stop(pc.red(msg));
    throw error;
  }
}
