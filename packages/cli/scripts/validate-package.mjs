import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");

const requiredPaths = [
  "package.json",
  "README.md",
  "CHANGELOG.md",
  "src/index.js",
  "src/utils/scaffold-pins.json",
  "templates/landing/_shared/CreatorLinks.tsx",
  "templates/shared/ts/src/features/home/index.ts",
];

let failed = false;

for (const relativePath of requiredPaths) {
  const fullPath = path.join(packageRoot, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`Missing required publish file: ${relativePath}`);
    failed = true;
  }
}

const pkg = JSON.parse(
  fs.readFileSync(path.join(packageRoot, "package.json"), "utf-8"),
);

if (pkg.name !== "create-react-dose") {
  console.error(`Expected package name "create-react-dose", got "${pkg.name}"`);
  failed = true;
}

if (!pkg.bin?.["create-react-dose"]) {
  console.error("Missing bin entry: create-react-dose");
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log("create-react-dose package validation passed.");
