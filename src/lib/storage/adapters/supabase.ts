import { randomUUID } from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { UploadInput, UploadResult } from "../index";

const BUCKET = "uploads";

function client() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY must be set when STORAGE_PROVIDER=supabase");
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function uploadSupabase(input: UploadInput): Promise<UploadResult> {
  const supabase = client();
  const ext = path.extname(input.filename).toLowerCase() || ".jpg";
  const filename = `${randomUUID()}${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filename, input.buffer, {
    contentType: input.mimeType,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return { url: data.publicUrl };
}

export async function deleteSupabase(url: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const filename = url.slice(idx + marker.length);
  await client().storage.from(BUCKET).remove([filename]).catch(() => {});
}
