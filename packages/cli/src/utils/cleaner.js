import fs from "fs";
import path from "path";
import * as p from "@clack/prompts";
import pc from "picocolors";

function safeUnlink(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function safeWrite(filePath, content) {
  fs.writeFileSync(filePath, content, "utf-8");
}

function cleanViteTemplate(targetDir, typescript) {
  for (const svg of ["react.svg", "vite.svg", "hero.png"]) {
    safeUnlink(path.join(targetDir, "src", "assets", svg));
  }
  for (const svg of ["favicon.svg", "icons.svg", "vite.svg"]) {
    safeUnlink(path.join(targetDir, "public", svg));
  }
  safeUnlink(path.join(targetDir, "src", "App.css"));
  safeWrite(path.join(targetDir, "src", "index.css"), "");

  const appFile = typescript ? "App.tsx" : "App.jsx";
  safeWrite(
    path.join(targetDir, "src", appFile),
    "export default function App() {\n  return null;\n}\n",
  );
}

function cleanNextJsTemplate(targetDir, typescript) {
  for (const svg of [
    "file.svg",
    "globe.svg",
    "next.svg",
    "window.svg",
    "vercel.svg",
  ]) {
    safeUnlink(path.join(targetDir, "public", svg));
  }
  safeUnlink(path.join(targetDir, "src", "app", "favicon.ico"));

  safeWrite(path.join(targetDir, "src", "app", "globals.css"), "");

  const pageFile = typescript ? "page.tsx" : "page.jsx";
  safeWrite(
    path.join(targetDir, "src", "app", pageFile),
    "export default function Page() {\n  return null;\n}\n",
  );
}

export async function cleanDefaultTemplate(project) {
  const s = p.spinner();
  const msg = "Sweeping away the default boilerplate junk... 🧹";

  s.start(pc.dim(msg));

  const targetDir = path.resolve(project.path);

  if (!fs.existsSync(targetDir)) {
    s.stop(pc.red(`Project directory not found: ${targetDir}`));
    throw new Error(`Project directory not found: ${targetDir}`);
  }

  try {
    if (project.framework === "next-core") {
      cleanNextJsTemplate(targetDir, project.typescript);
    } else {
      cleanViteTemplate(targetDir, project.typescript);
    }

    s.stop(pc.green(msg));
  } catch (error) {
    s.stop(pc.red("Failed to purge boilerplate files."));
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to clean default template: ${message}`);
  }
}
