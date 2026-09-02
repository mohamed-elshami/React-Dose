import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { copyDirectoryRecursive } from "./shared.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LANDING_DIR = path.resolve(__dirname, "../../../templates/landing");
const ASSETS_DIR = path.join(LANDING_DIR, "_shared", "assets");
const LOGO_SOURCE = path.join(ASSETS_DIR, "react-dose.webp");
const FAVICON_SOURCE = path.join(ASSETS_DIR, "favicon.ico");

function resolveLandingFlavor(project) {
  return project.framework === "next-core" ? "next" : "vite";
}

function safeUnlink(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function buildHomeStyles(project) {
  const brandCss = fs.readFileSync(
    path.join(LANDING_DIR, "_shared", "home-brand.css"),
    "utf-8",
  );

  if (project.tailwind) {
    return brandCss;
  }

  const utilitiesCss = fs.readFileSync(
    path.join(LANDING_DIR, "_shared", "home-utilities.css"),
    "utf-8",
  );

  return `${utilitiesCss}\n\n${brandCss}`;
}

function copyPublicFavicon(targetDir) {
  const publicDir = path.join(targetDir, "public");
  fs.mkdirSync(publicDir, { recursive: true });

  for (const name of ["favicon.svg", "favicon.jpg", "icon.jpg"]) {
    safeUnlink(path.join(publicDir, name));
  }

  fs.copyFileSync(FAVICON_SOURCE, path.join(publicDir, "favicon.ico"));
}

export function copyBrandFavicon(project, targetDir) {
  if (!fs.existsSync(FAVICON_SOURCE)) {
    return;
  }

  copyPublicFavicon(targetDir);

  if (project.framework === "next-core") {
    const appDir = path.join(targetDir, "src", "app");
    fs.mkdirSync(appDir, { recursive: true });
    safeUnlink(path.join(appDir, "icon.jpg"));
    fs.copyFileSync(FAVICON_SOURCE, path.join(appDir, "favicon.ico"));
    return;
  }

  if (project.architectureFlavor === "router-v7") {
    const ext = project.typescript ? "tsx" : "jsx";
    const rootPath = path.join(targetDir, "src", "app", `root.${ext}`);

    if (!fs.existsSync(rootPath)) {
      return;
    }

    const faviconLink = '<link rel="icon" href="/favicon.ico" sizes="any" />';
    let content = fs.readFileSync(rootPath, "utf-8");

    content = content.replace(
      /<link rel="icon"[^>]*href="\/favicon\.jpg"[^>]*\/?>/g,
      "",
    );

    if (!content.includes("/favicon.ico")) {
      content = content.replace(
        /<meta name="viewport" content="width=device-width, initial-scale=1" \/>/,
        `<meta name="viewport" content="width=device-width, initial-scale=1" />\n        ${faviconLink}`,
      );
    }

    fs.writeFileSync(rootPath, content, "utf-8");
    return;
  }

  const indexHtmlPath = path.join(targetDir, "index.html");

  if (!fs.existsSync(indexHtmlPath)) {
    return;
  }

  let html = fs.readFileSync(indexHtmlPath, "utf-8");
  html = html.replace(/<link rel="icon"[^>]*\/?>/g, "");
  html = html.replace(
    /<head>/,
    `<head>\n    <link rel="icon" href="/favicon.ico" sizes="any" />`,
  );
  fs.writeFileSync(indexHtmlPath, html, "utf-8");
}

export function copyLandingTemplate(project, targetDir) {
  const flavor = resolveLandingFlavor(project);
  const lang = project.typescript ? "ts" : "js";
  const sourceDir = path.join(LANDING_DIR, flavor, lang, "src", "features", "home");
  const homeDir = path.join(targetDir, "src", "features", "home");

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Landing template not found: ${sourceDir}`);
  }

  if (!fs.existsSync(LOGO_SOURCE)) {
    throw new Error(`Landing logo not found: ${LOGO_SOURCE}`);
  }

  copyDirectoryRecursive(
    path.join(sourceDir, "pages"),
    path.join(homeDir, "pages"),
  );

  safeUnlink(path.join(homeDir, "pages", "page.tsx"));
  safeUnlink(path.join(homeDir, "pages", "page.jsx"));

  fs.mkdirSync(path.join(homeDir, "assets"), { recursive: true });
  safeUnlink(path.join(homeDir, "assets", "react-dose.jpg"));
  fs.copyFileSync(LOGO_SOURCE, path.join(homeDir, "assets", "react-dose.webp"));

  const creatorLinksExt = project.typescript ? "tsx" : "jsx";
  const creatorLinksSource = project.typescript
    ? path.join(LANDING_DIR, "_shared", "creator-links.tsx")
    : path.join(LANDING_DIR, "_shared", "creator-links.jsx");
  safeUnlink(path.join(homeDir, "creator-links.jsx"));
  safeUnlink(path.join(homeDir, "creator-links.tsx"));
  fs.copyFileSync(
    creatorLinksSource,
    path.join(homeDir, `creator-links.${creatorLinksExt}`),
  );

  fs.writeFileSync(path.join(homeDir, "home.css"), buildHomeStyles(project), "utf-8");
  copyBrandFavicon(project, targetDir);
}
