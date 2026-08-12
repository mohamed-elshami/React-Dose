import path from "path";
import pc from "picocolors";

function formatProjectPath(projectPath) {
  const resolved = path.resolve(projectPath);
  const relative = path.relative(process.cwd(), resolved);

  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
    return relative.split(path.sep).join("/");
  }

  return resolved.split(path.sep).join("/");
}

export function buildCompletionMessage(
  project,
  { packageManager, shouldInstall },
) {
  const projectDir = formatProjectPath(project.path);
  const lines = [
    pc.green("Your React Dose ecosystem is ready to rock! ⚡"),
    "",
    pc.dim("Get started:"),
    `  ${pc.cyan("cd")} ${pc.bold(projectDir)}`,
  ];

  if (!shouldInstall) {
    lines.push(`  ${pc.cyan(`${packageManager} install`)}`);
  }

  lines.push(`  ${pc.cyan(`${packageManager} run dev`)}`);
  lines.push("");
  lines.push(
    pc.yellow("Happy hacking from React Dose"),
    pc.dim("Ship features, not boilerplate. 🎸"),
  );

  return lines.join("\n");
}
