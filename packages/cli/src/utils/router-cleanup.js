import fs from "fs";
import path from "path";

const ROUTER_APP_DIR = ["src", "app"];

function routerAppPath(targetDir, ...segments) {
  return path.join(targetDir, ...ROUTER_APP_DIR, ...segments);
}

function safeRemove(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function safeUnlink(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function safeWrite(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
}

export function relocateRouterAppToSrc(targetDir) {
  const rootAppDir = path.join(targetDir, "app");
  const srcAppDir = routerAppPath(targetDir);

  if (!fs.existsSync(rootAppDir)) {
    return;
  }

  fs.mkdirSync(path.join(targetDir, "src"), { recursive: true });

  if (fs.existsSync(srcAppDir)) {
    for (const entry of fs.readdirSync(rootAppDir)) {
      const sourcePath = path.join(rootAppDir, entry);
      const destinationPath = path.join(srcAppDir, entry);

      if (fs.existsSync(destinationPath)) {
        safeRemove(destinationPath);
      }

      fs.renameSync(sourcePath, destinationPath);
    }

    fs.rmdirSync(rootAppDir);
    return;
  }

  fs.renameSync(rootAppDir, srcAppDir);
}

export function patchReactRouterConfig(targetDir) {
  for (const fileName of ["react-router.config.ts", "react-router.config.js"]) {
    const configPath = path.join(targetDir, fileName);

    if (!fs.existsSync(configPath)) {
      continue;
    }

    let content = fs.readFileSync(configPath, "utf-8");

    if (content.includes("appDirectory")) {
      continue;
    }

    content = content.replace(
      /export default \{/,
      'export default {\n  appDirectory: "src/app",',
    );
    fs.writeFileSync(configPath, content, "utf-8");
  }
}

function stripTailwindClassesFromRoot(targetDir) {
  const rootCandidates = [
    routerAppPath(targetDir, "root.tsx"),
    routerAppPath(targetDir, "root.jsx"),
  ];

  for (const rootPath of rootCandidates) {
    if (!fs.existsSync(rootPath)) {
      continue;
    }

    let content = fs.readFileSync(rootPath, "utf-8");
    content = content.replace(/<main className="[^"]*">/, "<main>");
    content = content.replace(/<pre className="[^"]*">/, "<pre>");
    fs.writeFileSync(rootPath, content, "utf-8");
  }
}

export function stripTailwindFromRouterProject(targetDir) {
  for (const fileName of ["vite.config.ts", "vite.config.js"]) {
    const viteConfigPath = path.join(targetDir, fileName);

    if (!fs.existsSync(viteConfigPath)) {
      continue;
    }

    let viteConfig = fs.readFileSync(viteConfigPath, "utf-8");
    viteConfig = viteConfig.replace(
      /^import tailwindcss from "@tailwindcss\/vite";\n/m,
      "",
    );
    viteConfig = viteConfig.replace(/tailwindcss\(\),\s*/g, "");
    viteConfig = viteConfig.replace(/,\s*tailwindcss\(\)/g, "");
    fs.writeFileSync(viteConfigPath, viteConfig, "utf-8");
  }

  safeWrite(routerAppPath(targetDir, "app.css"), "");
  stripTailwindClassesFromRoot(targetDir);
}

export function cleanReactRouterTemplate(targetDir, project) {
  safeRemove(routerAppPath(targetDir, "welcome"));
  safeUnlink(path.join(targetDir, "Dockerfile"));
  safeUnlink(path.join(targetDir, ".dockerignore"));
  safeRemove(path.join(targetDir, ".agents"));
  safeUnlink(path.join(targetDir, "tsconfig.app.json"));

  safeWrite(
    routerAppPath(targetDir, "routes", "home.tsx"),
    `import { HomePage } from "@/features/home";

export default function Home() {
  return <HomePage />;
}
`,
  );

  const rootPath = routerAppPath(targetDir, "root.tsx");

  if (fs.existsSync(rootPath)) {
    let rootContent = fs.readFileSync(rootPath, "utf-8");
    rootContent = rootContent.replace(
      /export const links: Route\.LinksFunction[\s\S]*?\];\n\n/,
      "",
    );
    fs.writeFileSync(rootPath, rootContent, "utf-8");
  }

  if (!project.tailwind) {
    stripTailwindFromRouterProject(targetDir);
  }
}

export function normalizeRouterSrcLayout(targetDir) {
  safeUnlink(routerAppPath(targetDir, "page.tsx"));
  safeUnlink(routerAppPath(targetDir, "page.jsx"));
}

function stripTypeScriptSyntax(content) {
  return content
    .replace(/^import type .*;\n/gm, "")
    .replace(/import\s+\{\s*type\s+[A-Za-z0-9_]+\s*,/g, "import {")
    .replace(/,\s*type\s+[A-Za-z0-9_]+/g, "")
    .replace(/\s+satisfies\s+[A-Za-z0-9_.]+;/g, ";")
    .replace(/\}: Route\.[A-Za-z.]+/g, "}")
    .replace(/: Route\.[A-Za-z.]+/g, "")
    .replace(/: \{ children: React\.ReactNode \}/g, "")
    .replace(/: string \| undefined/g, "")
    .replace(/routes\/home\.tsx/g, "routes/home.jsx");
}

function renameExtension(filePath, fromExt, toExt) {
  if (!filePath.endsWith(fromExt)) {
    return filePath;
  }

  const nextPath = `${filePath.slice(0, -fromExt.length)}${toExt}`;
  fs.renameSync(filePath, nextPath);
  return nextPath;
}

function convertFileToJavaScript(filePath) {
  if (!/\.tsx?$/.test(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  content = stripTypeScriptSyntax(content);
  const nextPath = renameExtension(
    filePath,
    filePath.endsWith(".tsx") ? ".tsx" : ".ts",
    filePath.endsWith(".tsx") ? ".jsx" : ".js",
  );
  fs.writeFileSync(nextPath, content, "utf-8");
}

function walkAndConvertToJavaScript(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkAndConvertToJavaScript(entryPath);
      continue;
    }

    convertFileToJavaScript(entryPath);
  }
}

function writeRouterJavaScriptTsconfig(targetDir) {
  safeWrite(
    path.join(targetDir, "tsconfig.json"),
    `${JSON.stringify(
      {
        include: [
          "src",
          "**/*",
          "**/.server/**/*",
          "**/.client/**/*",
          ".react-router/types/**/*",
        ],
        compilerOptions: {
          allowJs: true,
          checkJs: false,
          lib: ["DOM", "DOM.Iterable", "ES2022"],
          target: "ES2022",
          module: "ES2022",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          rootDirs: [".", "./.react-router/types"],
          paths: {
            "@/*": ["./src/*"],
          },
          esModuleInterop: true,
          noEmit: true,
          resolveJsonModule: true,
          skipLibCheck: true,
        },
      },
      null,
      2,
    )}\n`,
  );
}

export function convertRouterProjectToJavaScript(targetDir, pkg) {
  for (const fileName of ["react-router.config.ts", "vite.config.ts"]) {
    const filePath = path.join(targetDir, fileName);

    if (fs.existsSync(filePath)) {
      convertFileToJavaScript(filePath);
    }
  }

  walkAndConvertToJavaScript(routerAppPath(targetDir));

  safeUnlink(path.join(targetDir, "tsconfig.app.json"));
  safeUnlink(path.join(targetDir, "jsconfig.json"));
  writeRouterJavaScriptTsconfig(targetDir);
  patchReactRouterConfig(targetDir);

  if (pkg?.scripts?.typecheck) {
    delete pkg.scripts.typecheck;
  }

  if (pkg?.devDependencies) {
    delete pkg.devDependencies.typescript;
    delete pkg.devDependencies["@types/node"];
    delete pkg.devDependencies["@types/react"];
    delete pkg.devDependencies["@types/react-dom"];
  }
}

export function finalizeRouterPackageManifest(project, pkg) {
  if (!project.tailwind && pkg?.devDependencies) {
    delete pkg.devDependencies.tailwindcss;
    delete pkg.devDependencies["@tailwindcss/vite"];
  }
}
