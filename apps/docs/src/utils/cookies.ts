export type CookieValue = string | number | boolean | object;

export type CookieOptions = {
  /** Days until expiry, or an exact date */
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
};

function isBrowserCookiesAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof document.cookie === "string"
  );
}

function serializeCookieValue(value: CookieValue): string {
  const raw = typeof value === "string" ? value : JSON.stringify(value);
  return encodeURIComponent(raw);
}

function parseCookieValue<T = string>(raw: string): T | null {
  try {
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded) as T;
  } catch {
    return decodeURIComponent(raw) as T;
  }
}

function buildCookieString(
  name: string,
  value: string,
  options: CookieOptions = {},
): string {
  const parts = [`${encodeURIComponent(name)}=${value}`];

  if (options.expires !== undefined) {
    const expires =
      typeof options.expires === "number"
        ? new Date(Date.now() + options.expires * 86_400_000)
        : options.expires;

    parts.push(`expires=${expires.toUTCString()}`);
  }

  if (options.path) {
    parts.push(`path=${options.path}`);
  }

  if (options.domain) {
    parts.push(`domain=${options.domain}`);
  }

  if (options.secure) {
    parts.push("secure");
  }

  if (options.sameSite) {
    parts.push(`samesite=${options.sameSite}`);
  }

  return parts.join("; ");
}

/**
 * getCookie
 * Reads a cookie by name and parses JSON values when possible.
 *
 * @param name - Cookie name to read
 * @returns Parsed cookie value, or `null` when missing or unavailable (SSR)
 *
 * @example
 * const theme = getCookie<string>("theme");
 */
export function getCookie<T = string>(name: string): T | null {
  if (!isBrowserCookiesAvailable()) {
    return null;
  }

  const prefix = `${encodeURIComponent(name)}=`;
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix));

  if (!match) {
    return null;
  }

  return parseCookieValue<T>(match.slice(prefix.length));
}

/**
 * setCookie
 * Creates or overwrites a browser cookie.
 *
 * @param name - Cookie name
 * @param value - Cookie value (objects are JSON-stringified)
 * @param options - Optional cookie attributes (`expires`, `path`, `domain`, `secure`, `sameSite`)
 * @returns `true` if the cookie was set, otherwise `false`
 *
 * @example
 * setCookie("theme", "dark", { expires: 7, path: "/", sameSite: "lax" });
 */
export function setCookie(
  name: string,
  value: CookieValue,
  options: CookieOptions = {},
): boolean {
  if (!isBrowserCookiesAvailable()) {
    return false;
  }

  try {
    document.cookie = buildCookieString(
      name,
      serializeCookieValue(value),
      options,
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * updateCookie
 * Merges a partial object into an existing object cookie.
 *
 * @param name - Cookie name
 * @param partial - Fields to merge into the stored object
 * @param options - Optional cookie attributes applied on write
 * @returns `true` if the cookie was updated, otherwise `false`
 *
 * @example
 * updateCookie("prefs", { theme: "dark" });
 */
export function updateCookie<T extends Record<string, unknown>>(
  name: string,
  partial: Partial<T>,
  options: CookieOptions = {},
): boolean {
  const current = getCookie<T>(name);

  if (current === null || typeof current !== "object") {
    return setCookie(name, partial as CookieValue, options);
  }

  return setCookie(name, { ...current, ...partial }, options);
}

/**
 * removeCookie
 * Deletes a cookie by name.
 *
 * @param name - Cookie name to delete
 * @param options - Optional `path` and `domain` (must match the cookie that was set)
 * @returns `true` if removal was attempted successfully, otherwise `false`
 *
 * @example
 * removeCookie("theme", { path: "/" });
 */
export function removeCookie(
  name: string,
  options: Pick<CookieOptions, "path" | "domain"> = {},
): boolean {
  if (!isBrowserCookiesAvailable()) {
    return false;
  }

  try {
    document.cookie = buildCookieString(name, "", {
      ...options,
      expires: new Date(0),
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * hasCookie
 * Checks whether a cookie exists.
 *
 * @param name - Cookie name
 * @returns `true` if the cookie exists, otherwise `false`
 *
 * @example
 * if (hasCookie("consent")) { ... }
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * getAllCookies
 * Returns all readable cookies as a key-value map.
 *
 * @returns Record of cookie names to raw string values, or `{}` on SSR
 *
 * @example
 * const cookies = getAllCookies();
 */
export function getAllCookies(): Record<string, string> {
  if (!isBrowserCookiesAvailable() || !document.cookie) {
    return {};
  }

  return document.cookie.split("; ").reduce<Record<string, string>>(
    (cookies, entry) => {
      const separator = entry.indexOf("=");
      if (separator === -1) {
        return cookies;
      }

      const key = decodeURIComponent(entry.slice(0, separator));
      const value = decodeURIComponent(entry.slice(separator + 1));
      cookies[key] = value;
      return cookies;
    },
    {},
  );
}

/**
 * clearCookies
 * Removes every readable cookie.
 *
 * @param options - Optional `path` and `domain` passed to each removal
 * @returns `true` if all cookies were removed, otherwise `false`
 *
 * @example
 * clearCookies({ path: "/" });
 */
export function clearCookies(
  options: Pick<CookieOptions, "path" | "domain"> = {},
): boolean {
  if (!isBrowserCookiesAvailable()) {
    return false;
  }

  const keys = Object.keys(getAllCookies());
  return keys.every((name) => removeCookie(name, options));
}
