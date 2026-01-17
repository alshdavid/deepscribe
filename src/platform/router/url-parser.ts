export const normalizePathname = (
  baseName: string,
  path?: string,
): string => {
  const normalizedBase = baseName
    ? baseName.replace(/\/$/, '').toLowerCase()
    : '';
  
  const normalizedPath = (path || '/').toLowerCase();
  
  if (!normalizedBase && normalizedPath === '/') {
    return '/';
  }
  
  if (normalizedPath === '/') {
    return normalizedBase || '/';
  }
  
  return normalizedBase + normalizedPath;
};

/**
 * @description
 * Will match a url declaration with an incoming pathname
 *   /users/:id/edit
 *   /users/5345/edit
 */
export const matchPath = (
  pattern: string,
  pathname: string,
): Record<string, string> | undefined => {
  pattern = normalizePathname(pattern);
  const params: Record<string, string> = {};
  const source = pattern.split("/");
  const test = pathname.split("/");

  if (source.length !== test.length && !pattern.includes("**")) {
    return;
  }

  for (const i in source) {
    if (source[i].startsWith(":") && pathname !== "/") {
      const paramName = source[i].slice(1);
      params[paramName] = test[i].toString();
      continue;
    }
    if (source[i].startsWith("**")) {
      return params;
    }
    if (source[i] !== test[i].toLowerCase()) {
      return;
    }
  }
  return params;
};
