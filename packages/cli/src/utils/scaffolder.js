import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as p from "@clack/prompts";
import pc from "picocolors";

const execPromise = promisify(exec);
const execEnv = { ...process.env, FORCE_COLOR: "1" };

const pinsPath = fileURLToPath(new URL("./scaffold-pins.json", import.meta.url));
const scaffoldPins = JSON.parse(fs.readFileSync(pinsPath, "utf-8"));

function resolvePackageSpec(packageName, pinnedVersion) {
  if (process.env.REACT_DOSE_SCAFFOLD_LATEST === "1") {
    return `${packageName}@latest`;
  }

  return `${packageName}@${pinnedVersion}`;
}

function resolveViteTemplate(project) {
  if (project.reactCompiler) {
    return project.typescript ? "react-compiler-ts" : "react-compiler";
  }

  return project.typescript ? "react-ts" : "react";
}

function resolveViteLintFlag(project) {
  return project.viteLinter === "oxlint" ? "--no-eslint" : "--eslint";
}

function resolveScaffoldPath(projectPath) {
  const resolved = path.resolve(projectPath);
  const relative = path.relative(process.cwd(), resolved);

  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
    return relative.split(path.sep).join("/");
  }

  return resolved.split(path.sep).join("/");
}

export async function downloadOfficialTemplate(project) {
  const s = p.spinner();
  const scaffoldPath = resolveScaffoldPath(project.path);
  const isRouter =
    project.framework === "react-core" &&
    project.architectureFlavor === "router-v7";

  try {
    if (project.framework === "next-core") {
      const tsFlag = project.typescript ? "--ts" : "--js";
      const msg = "Cooking up your Next.js Core environment... 🚀";

      s.start(pc.dim(msg));

      const createNextApp = resolvePackageSpec(
        "create-next-app",
        scaffoldPins.createNextApp,
      );

      const tailwindFlag = project.tailwind ? "--tailwind" : "--no-tailwind";

      await execPromise(
        `npx ${createNextApp} "${scaffoldPath}" ${tsFlag} ${tailwindFlag} --app --src-dir --import-alias "@/*" --eslint ${project.reactCompiler ? "--react-compiler" : ""} --no-git --skip-install`,
        { env: execEnv },
      );

      s.stop(pc.green(msg));
    } else if (isRouter) {
      const msg = "Cooking up your React Router environment... 🛣️";

      s.start(pc.dim(msg));

      const createReactRouter = resolvePackageSpec(
        "create-react-router",
        scaffoldPins.createReactRouter,
      );

      await execPromise(
        `npx ${createReactRouter} "${scaffoldPath}" --yes --no-install --no-git-init --no-agent-skills`,
        { env: execEnv },
      );

      s.stop(pc.green(msg));
    } else {
      const templateFlag = resolveViteTemplate(project);
      const lintFlag = resolveViteLintFlag(project);
      const msg = "Cooking up your Vite Core environment... 🥞";

      s.start(pc.dim(msg));

      const createVite = resolvePackageSpec("vite", scaffoldPins.createVite);

      await execPromise(
        `npm create ${createVite} "${scaffoldPath}" -- --template ${templateFlag} ${lintFlag}`,
        { env: execEnv },
      );

      s.stop(pc.green(msg));
    }
  } catch (error) {
    s.stop(pc.red("Failed to download template."));
    throw error;
  }
}
