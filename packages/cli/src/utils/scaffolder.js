import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import * as p from "@clack/prompts";
import pc from "picocolors";

const execPromise = promisify(exec);

const execEnv = { ...process.env, FORCE_COLOR: "1" };

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

  try {
    if (project.framework === "next-core") {
      const tsFlag = project.typescript ? "--ts" : "--js";
      const msg = "Cooking up your Next.js Core environment... 🚀";

      s.start(pc.dim(msg));

      await execPromise(
        `npx create-next-app@latest "${scaffoldPath}" ${tsFlag} --tailwind false --app --src-dir --import-alias "@/*" --eslint ${project.reactCompiler ? "--react-compiler" : ""} --no-git --skip-install`,
        { env: execEnv },
      );

      s.stop(pc.green(msg));
    } else {
      const templateFlag = project.typescript ? "react-ts" : "react";
      const msg = "Cooking up your Vite Core environment... 🥞";

      s.start(pc.dim(msg));

      await execPromise(
        `npm create vite@latest "${scaffoldPath}" -- --template ${templateFlag}`,
        { env: execEnv },
      );

      s.stop(pc.green(msg));
    }
  } catch (error) {
    s.stop(pc.red("Failed to download template."));
    throw error;
  }
}
