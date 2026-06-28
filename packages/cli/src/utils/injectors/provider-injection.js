import fs from "fs";

function normalizeProviderImports(providerWrapper) {
  if (!providerWrapper) {
    return [];
  }

  if (Array.isArray(providerWrapper.imports)) {
    return providerWrapper.imports;
  }

  if (providerWrapper.import) {
    return [providerWrapper.import];
  }

  return [];
}

export function parseProviderTag(component) {
  const match = component.match(/^<([A-Za-z][\w.-]*)([^>]*)>$/);

  if (!match) {
    throw new Error(`Invalid providerWrapper.component: ${component}`);
  }

  return {
    openTag: component,
    closeTag: `</${match[1]}>`,
  };
}

function insertAfterUseClient(content, line) {
  if (content.startsWith('"use client";')) {
    return content.replace('"use client";\n', `"use client";\n\n${line}`);
  }

  return `${line}\n${content}`;
}

function prependImports(content, importLines, { afterUseClient = false } = {}) {
  let output = content;

  for (const importLine of importLines) {
    if (output.includes(importLine)) {
      continue;
    }

    output = afterUseClient
      ? insertAfterUseClient(output, `${importLine}\n`)
      : `${importLine}\n${output}`;
  }

  return output;
}

function addRootProviderProps(content, rootProviderProps, isTypescript) {
  if (!rootProviderProps) {
    return content;
  }

  const propsDef = isTypescript
    ? rootProviderProps.typescript
    : rootProviderProps.javascript;

  if (!propsDef) {
    return content;
  }

  const propsList = isTypescript
    ? propsDef
        .split(";")
        .map((prop) => prop.trim())
        .filter(Boolean)
    : propsDef
        .split(",")
        .map((prop) => prop.trim())
        .filter(Boolean);

  if (propsList.length === 0) {
    return content;
  }

  const propNames = propsList.map((prop) => prop.split(":")[0].trim());
  const signatureStart = content.slice(0, content.indexOf("{"));

  if (
    propNames.every((propName) =>
      new RegExp(`\\b${propName}\\b`).test(signatureStart),
    )
  ) {
    return content;
  }

  const destructure = `children, ${propNames.join(", ")}`;

  if (isTypescript) {
    const typeBody = propsList.join("; ");

    return (
      content.replace(
        /function RootProvider\(\{\s*children\s*\}:\s*\{\s*children:\s*React\.ReactNode\s*\}\)/,
        `function RootProvider({ ${destructure} }: { children: React.ReactNode; ${typeBody} })`,
      ) ||
      content.replace(
        /default function RootProvider\(\{\s*children\s*\}:\s*\{\s*children:\s*React\.ReactNode\s*\}\)/,
        `default function RootProvider({ ${destructure} }: { children: React.ReactNode; ${typeBody} })`,
      )
    );
  }

  return (
    content.replace(
      /function RootProvider\(\{\s*children\s*\}\)/,
      `function RootProvider({ ${destructure} })`,
    ) ||
    content.replace(
      /default function RootProvider\(\{\s*children\s*\}\)/,
      `default function RootProvider({ ${destructure} })`,
    )
  );
}

function wrapChildrenInProvider(content, openTag, closeTag) {
  if (content.includes(openTag)) {
    return content;
  }

  return content.replace(
    /\{children\}/,
    `${openTag}\n      {children}\n    ${closeTag}`,
  );
}

/**
 * Metadata-driven provider composition — nests providerWrapper.component around {children}.
 */
export function injectIntoRootProvider(
  providerPath,
  featureMetadata,
  { isTypescript = false, useClientDirective = false } = {},
) {
  const { providerWrapper, rootProviderTypeImports, rootProviderProps } =
    featureMetadata;

  if (!providerWrapper?.component) {
    return;
  }

  let content = fs.readFileSync(providerPath, "utf-8");
  const importLines = normalizeProviderImports(providerWrapper);

  if (rootProviderTypeImports?.typescript && isTypescript) {
    importLines.unshift(rootProviderTypeImports.typescript);
  }

  content = prependImports(content, importLines, {
    afterUseClient: useClientDirective,
  });
  content = addRootProviderProps(content, rootProviderProps, isTypescript);

  const { openTag, closeTag } = parseProviderTag(providerWrapper.component);
  content = wrapChildrenInProvider(content, openTag, closeTag);

  fs.writeFileSync(providerPath, content, "utf-8");
}

export function injectProvidersFromMetadata(
  providerPath,
  featureMetadataList,
  options = {},
) {
  for (const metadata of featureMetadataList) {
    if (metadata.providerWrapper) {
      injectIntoRootProvider(providerPath, metadata, options);
    }
  }
}
