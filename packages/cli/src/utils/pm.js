/**
 * Detects the current Package Manager used by the developer
 * based on the user agent environment variable.
 * @returns {'pnpm' | 'bun' | 'yarn' | 'npm'}
 */
export function getPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.includes("pnpm")) return "pnpm";
  if (userAgent.includes("bun")) return "bun";
  if (userAgent.includes("yarn")) return "yarn";
  return "npm"; // Fallback to npm if undetected
}
