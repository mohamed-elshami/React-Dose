#!/usr/bin/env node

import * as p from "@clack/prompts";
import pc from "picocolors";
import { collectProjectPreferences } from "./utils/prompts.js";
import { downloadOfficialTemplate } from "./utils/scaffolder.js";
import { cleanDefaultTemplate } from "./utils/cleaner.js";
import { injectEcosystemDependencies } from "./utils/injector.js";

async function main() {
  p.intro(pc.bgCyan(pc.black(" ⚡ REACT DOSE TOOLCHAIN ⚡ ")));

  const argumentPath = process.argv[2];
  const project = await collectProjectPreferences(argumentPath);

  try {
    await downloadOfficialTemplate(project);
    await cleanDefaultTemplate(project);
    await injectEcosystemDependencies(project);

    p.outro(
      pc.yellow(
        "All set! Your React Dose ecosystem is ready to rock. Happy hacking! ⚡🎸",
      ),
    );
    process.exit(0);
  } catch (error) {
    p.note(pc.red("Ecosystem creation halted due to an error."));
    console.error(error);
    process.exit(1);
  }
}

main();
