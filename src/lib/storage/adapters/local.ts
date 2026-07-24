import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { UploadInput, UploadResult } from "../index";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads/";

export async function uploadLocal(input: UploadInput): Promise<UploadResult> {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(input.filename).toLowerCase() || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await input.file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { url: `${PUBLIC_PREFIX}${filename}` };
}

export async function deleteLocal(url: string): Promise<void> {
  if (!url.startsWith(PUBLIC_PREFIX)) return;
  const filePath = path.join(UPLOAD_DIR, url.slice(PUBLIC_PREFIX.length));
  await unlink(filePath).catch(() => {});
}
