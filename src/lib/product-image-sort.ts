/**
 * Sort gallery paths by the first number in the filename
 * (e.g. …/foo-001.jpg before …/foo-002.jpg). Paths without digits go last.
 */
export function extractFilenameSortNumber(path: string): number {
  const base = path.split("/").pop() ?? path;
  const nameWithoutExt = base.replace(/\.[^.]+$/u, "");
  const match = nameWithoutExt.match(/(\d+)/u);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number.parseInt(match[1], 10);
}

export function sortImagePathsByFilename(paths: string[]): string[] {
  return [...paths].sort((a, b) => {
    const numA = extractFilenameSortNumber(a);
    const numB = extractFilenameSortNumber(b);
    if (numA !== numB) return numA - numB;
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}

export function sortFilesByFilename(files: File[]): File[] {
  return [...files].sort((a, b) => {
    const numA = extractFilenameSortNumber(a.name);
    const numB = extractFilenameSortNumber(b.name);
    if (numA !== numB) return numA - numB;
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}
