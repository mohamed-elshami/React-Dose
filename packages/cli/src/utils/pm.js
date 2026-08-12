import fs from "fs";
import path from "path";

/**
 * Detects the package manager the developer is using.
 * @returns {'pnpm' | 'bun' | 'yarn' | 'npm'}
 */
export function getPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";

  if (userAgent.includes("pnpm")) return "pnpm";
  if (userAgent.includes("bun")) return "bun";
  if (userAgent.includes("yarn")) return "yarn";

  const execPath = process.env.npm_execpath || "";

  if (execPath.includes("pnpm")) return "pnpm";
  if (execPath.includes("bun")) return "bun";
  if (execPath.includes("yarn")) return "yarn";

  const cwd = process.cwd();

  for (let dir = cwd; ; dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
    if (
      fs.existsSync(path.join(dir, "bun.lockb")) ||
      fs.existsSync(path.join(dir, "bun.lock"))
    ) {
      return "bun";
    }
    if (fs.existsSync(path.join(dir, "yarn.lock"))) return "yarn";
    if (fs.existsSync(path.join(dir, "package-lock.json"))) return "npm";

    if (dir === path.dirname(dir)) {
      break;
    }
  }

  return "npm";
}
