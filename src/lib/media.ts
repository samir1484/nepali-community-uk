import fs from "node:fs";
import path from "node:path";

export function publicFileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", relativePath));
}

export function firstExistingPublicFile(relativePaths: string[]): string | null {
  for (const relativePath of relativePaths) {
    if (publicFileExists(relativePath)) return relativePath;
  }
  return null;
}
