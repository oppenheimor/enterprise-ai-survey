const defaultBasePath = "/enterprise-ai-survey";

function normalizeBasePath(value?: string) {
  if (!value || value === "/") {
    return "";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? defaultBasePath);

export function withBasePath(path: string) {
  if (!path) {
    return basePath || "/";
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return basePath ? `${basePath}${normalizedPath}` : normalizedPath;
}
