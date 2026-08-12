#!/usr/bin/env node

import * as p from "@clack/prompts";
import pc from "picocolors";
import { collectProjectPreferences } from "./utils/prompts.js";
import { downloadOfficialTemplate } from "./utils/scaffolder.js";
import { cleanDefaultTemplate } from "./utils/cleaner.js";
import { injectEcosystemDependencies } from "./utils/injector.js";
import { getPackageManager } from "./utils/pm.js";
import { installProjectDependencies } from "./utils/installer.js";
import { buildCompletionMessage } from "./utils/completion-message.js";

function centerText(text, width) {
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return `${" ".repeat(pad)}${text}`;
}

function buildBanner() {
  const react = [
    "888b. 8888    db    .d88b 88888",
    "8  .8 8www   dPYb   8P      8  ",
    "8wwK' 8     dPwwYb  8b      8  ",
    "8  Yb 8888 dP    Yb `Y88P   8  ",
  ];
  const dose = [
    "888b. .d88b. .d88b. 8888",
    "8   8 8P  Y8 YPwww. 8www",
    "8   8 8b  d8     d8 8   ",
    "888P' `Y88P' `Y88P' 8888",
  ];

  const reactWidth = Math.max(...react.map((line) => line.length));
  const gap = "      ";
  const doseWidth = Math.max(...dose.map((line) => line.length));
  const bannerWidth = reactWidth + gap.length + doseWidth;

  const art = react.map((line, index) => {
    const left = line.padEnd(reactWidth);
    return pc.cyan(left) + gap + pc.yellow(dose[index] ?? "");
  });

  const welcome = pc.dim(centerText("W E L C O M E   T O", bannerWidth));
  const toolchain = pc.dim(centerText("T O O L C H A I N", bannerWidth));

  return ["", "", welcome, "", ...art, "", toolchain, ""].join("\n");
}

async function main() {
  p.intro(buildBanner());

  const argumentPath = process.argv[2];
  const project = await collectProjectPreferences(argumentPath);

  try {
    await downloadOfficialTemplate(project);
    await cleanDefaultTemplate(project);
    await injectEcosystemDependencies(project);

    const packageManager = getPackageManager();
    const shouldInstall = await p.confirm({
      message: `Would you like to install dependencies now with ${packageManager}?`,
      initialValue: true,
    });

    if (p.isCancel(shouldInstall)) {
      p.cancel("Scaffolding cancelled by user.");
      process.exit(0);
    }

    if (shouldInstall) {
      await installProjectDependencies(project.path, packageManager);
    }

    p.note(
      buildCompletionMessage(project, { packageManager, shouldInstall }),
      "React Dose",
    );

    p.outro(pc.dim("You're all set. Go build something awesome."));
    process.exit(0);
  } catch (error) {
    p.note(pc.red("Ecosystem creation halted due to an error."));
    console.error(error);
    process.exit(1);
  }
}

main();
