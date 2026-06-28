import fs from "fs";
import path from "path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
  buildBaseEcosystemDependencies,
  sortDependencies,
} from "./injectors/shared.js";
import { processViteEcosystem } from "./injectors/vite.js";
import { processNextEcosystem } from "./injectors/next.js";

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
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const baseDeps = buildBaseEcosystemDependencies(
        project,
        pkg.devDependencies,
      );

      let frameworkDeps = {
        dependencies: {},
        devDependencies: {},
        devDependenciesToRemove: [],
      };

      if (project.framework === "react-core") {
        frameworkDeps = await processViteEcosystem(project, targetDir, pkg);
      } else if (project.framework === "next-core") {
        frameworkDeps = await processNextEcosystem(project, targetDir, pkg);
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

      fs.writeFileSync(
        packageJsonPath,
        `${JSON.stringify(sortDependencies(pkg), null, 2)}\n`,
        "utf-8",
      );

      s.stop(pc.green(msg));
    } finally {
      console.log = originalLog;
      console.info = originalInfo;
      console.warn = originalWarn;
    }
  } catch (error) {
    s.stop(pc.red(msg));
    throw error;
  }
}
