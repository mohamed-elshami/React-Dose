import fs from "fs";
import path from "path";

function resolveStackLabel(project) {
  if (project.framework === "next-core") {
    return "Next.js App Router";
  }

  if (project.architectureFlavor === "router-v7") {
    return "React Router v7";
  }

  return "Vite SPA";
}

function resolveProjectName(project) {
  return path.basename(path.resolve(project.path));
}

function buildReadme(project) {
  const name = resolveProjectName(project);
  const stack = resolveStackLabel(project);

  return `# React Dose

**${name}** — ${stack} scaffold.

## Structure

\`\`\`
src/
├── app/          # App shell (routes, layout, providers, global styles)
├── features/     # Feature modules (UI, hooks, services per domain)
└── utils/        # Shared helpers (cookies, localStorage, etc.)
\`\`\`

## Scripts

\`\`\`bash
npm run dev     # Start development server
npm run build   # Production build
\`\`\`

Scaffolded with [React Dose CLI](https://github.com/mohamed-elshami/react-dose-ecosystem).
`;
}

function patchSpaIndexHtml(targetDir) {
  const indexHtmlPath = path.join(targetDir, "index.html");

  if (!fs.existsSync(indexHtmlPath)) {
    return;
  }

  let html = fs.readFileSync(indexHtmlPath, "utf-8");
  html = html.replace(/<title>[^<]*<\/title>/i, "<title>React Dose</title>");
  fs.writeFileSync(indexHtmlPath, html, "utf-8");
}

function patchRouterAppCss(targetDir, project) {
  if (!project.tailwind || project.architectureFlavor !== "router-v7") {
    return;
  }

  const appCssPath = path.join(targetDir, "src", "app", "app.css");

  if (!fs.existsSync(appCssPath)) {
    return;
  }

  fs.writeFileSync(appCssPath, '@import "tailwindcss";\n', "utf-8");
}

function appendGitignoreEntries(targetDir, entries) {
  const gitignorePath = path.join(targetDir, ".gitignore");

  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, `${entries.join("\n")}\n`, "utf-8");
    return;
  }

  let content = fs.readFileSync(gitignorePath, "utf-8");
  const missing = entries.filter((entry) => !content.includes(entry));

  if (missing.length === 0) {
    return;
  }

  content = content.replace(/\s*$/, "");
  fs.writeFileSync(gitignorePath, `${content}\n${missing.join("\n")}\n`, "utf-8");
}

export function finalizeProjectPolish(project, targetDir, pkg) {
  pkg.name = resolveProjectName(project);

  fs.writeFileSync(
    path.join(targetDir, "README.md"),
    buildReadme(project),
    "utf-8",
  );

  if (
    project.framework === "react-core" &&
    project.architectureFlavor === "spa"
  ) {
    patchSpaIndexHtml(targetDir);
  }

  if (project.architectureFlavor === "router-v7") {
    patchRouterAppCss(targetDir, project);
  }

  if (project.framework === "next-core") {
    appendGitignoreEntries(targetDir, ["AGENTS.md", "CLAUDE.md"]);
  }
}
