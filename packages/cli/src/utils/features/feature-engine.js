/**
 * Shared feature metadata engine for React and Next templates.
 */

const KNOWN_ENABLED_WHEN = new Set([
  "always",
  "typescript",
  "i18n",
  "tailwind",
  "reactCompiler",
]);

const KNOWN_TOP_LEVEL_KEYS = new Set([
  "name",
  "order",
  "enabledWhen",
  "dependencies",
  "devDependencies",
  "devDependenciesToRemove",
  "packageScripts",
  "providerWrapper",
  "rootProviderTypeImports",
  "rootProviderProps",
  "layoutTarget",
  "layoutProviderProps",
  "vite",
  "entryHydration",
  "cleanup",
  "cleanupStores",
  "nextConfig",
]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateEnabledWhen(enabledWhen, sourceLabel) {
  if (enabledWhen == null) {
    return;
  }

  assert(
    typeof enabledWhen === "string",
    `${sourceLabel}: "enabledWhen" must be a string`,
  );

  if (KNOWN_ENABLED_WHEN.has(enabledWhen)) {
    return;
  }

  if (enabledWhen.startsWith("store:")) {
    const store = enabledWhen.slice("store:".length);
    assert(
      store.length > 0,
      `${sourceLabel}: "enabledWhen" store value is empty`,
    );
    return;
  }

  if (enabledWhen.startsWith("architecture:")) {
    const flavor = enabledWhen.slice("architecture:".length);
    assert(
      flavor.length > 0,
      `${sourceLabel}: "enabledWhen" architecture value is empty`,
    );
    return;
  }

  throw new Error(
    `${sourceLabel}: unknown "enabledWhen" value "${enabledWhen}"`,
  );
}

/**
 * Lightweight metadata validation (no external schema dependency).
 * Throws with a clear path-labeled error when metadata is invalid.
 */
export function validateFeatureMetadata(metadata, sourceLabel = "metadata.json") {
  assert(isPlainObject(metadata), `${sourceLabel}: metadata must be an object`);

  assert(
    typeof metadata.name === "string" && metadata.name.length > 0,
    `${sourceLabel}: "name" is required and must be a non-empty string`,
  );

  if (metadata.order != null) {
    assert(
      typeof metadata.order === "number" && Number.isFinite(metadata.order),
      `${sourceLabel}: "order" must be a number`,
    );
  }

  validateEnabledWhen(metadata.enabledWhen, sourceLabel);

  for (const key of Object.keys(metadata)) {
    assert(
      KNOWN_TOP_LEVEL_KEYS.has(key),
      `${sourceLabel}: unknown field "${key}"`,
    );
  }

  for (const mapKey of ["dependencies", "devDependencies", "packageScripts"]) {
    if (metadata[mapKey] != null) {
      assert(
        isPlainObject(metadata[mapKey]),
        `${sourceLabel}: "${mapKey}" must be an object`,
      );
    }
  }

  if (metadata.devDependenciesToRemove != null) {
    assert(
      Array.isArray(metadata.devDependenciesToRemove) &&
        metadata.devDependenciesToRemove.every((item) => typeof item === "string"),
      `${sourceLabel}: "devDependenciesToRemove" must be an array of strings`,
    );
  }

  if (metadata.providerWrapper != null) {
    assert(
      isPlainObject(metadata.providerWrapper),
      `${sourceLabel}: "providerWrapper" must be an object`,
    );
    assert(
      typeof metadata.providerWrapper.component === "string",
      `${sourceLabel}: "providerWrapper.component" is required`,
    );
  }

  if (metadata.vite != null) {
    assert(
      isPlainObject(metadata.vite),
      `${sourceLabel}: "vite" must be an object`,
    );
  }

  if (metadata.cleanup != null) {
    assert(
      isPlainObject(metadata.cleanup),
      `${sourceLabel}: "cleanup" must be an object`,
    );
  }

  if (metadata.entryHydration != null) {
    assert(
      isPlainObject(metadata.entryHydration),
      `${sourceLabel}: "entryHydration" must be an object`,
    );
  }

  return metadata;
}

export function isFeatureEnabled(project, metadata) {
  const when = metadata.enabledWhen;

  if (!when || when === "always") {
    return true;
  }

  if (when === "typescript") {
    return Boolean(project.typescript);
  }

  if (when === "i18n") {
    return Boolean(project.i18n);
  }

  if (when === "tailwind") {
    return Boolean(project.tailwind);
  }

  if (when === "reactCompiler") {
    return Boolean(project.reactCompiler);
  }

  if (when.startsWith("store:")) {
    return project.store === when.slice("store:".length);
  }

  if (when.startsWith("architecture:")) {
    return project.architectureFlavor === when.slice("architecture:".length);
  }

  return false;
}
