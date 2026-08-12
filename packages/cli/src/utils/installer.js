import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { getPackageManager } from "./pm.js";

const execPromise = promisify(exec);
const execEnv = { ...process.env, FORCE_COLOR: "1" };

const installCommands = {
  npm: "npm install",
  pnpm: "pnpm install",
  yarn: "yarn install",
  bun: "bun install",
};

export function resolveInstallCommand(packageManager) {
  return installCommands[packageManager] ?? installCommands.npm;
}

export async function installProjectDependencies(projectPath, packageManager) {
  const pm = packageManager ?? getPackageManager();
  const targetDir = path.resolve(projectPath);
  const command = resolveInstallCommand(pm);
  const s = p.spinner();
  const msg = `Installing dependencies with ${pm}...`;

  s.start(pc.dim(msg));

  try {
    await execPromise(command, { cwd: targetDir, env: execEnv });
    s.stop(pc.green(msg));
    return pm;
  } catch (error) {
    s.stop(pc.red(`Failed to install dependencies with ${pm}.`));
    throw error;
  }
}
