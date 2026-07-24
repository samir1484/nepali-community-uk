export type UploadInput = {
  file: File;
  filename: string;
  mimeType: string;
};

export type UploadResult = {
  url: string;
};

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

export function validateImageUpload(file: { size: number; type: string }): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, WEBP, or GIF images are allowed.";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be 5MB or smaller.";
  }
  return null;
}

export async function uploadImage(input: UploadInput): Promise<UploadResult> {
  const provider = process.env.STORAGE_PROVIDER ?? "local";

  if (provider === "local") {
    const { uploadLocal } = await import("./adapters/local");
    return uploadLocal(input);
  }

  if (provider === "supabase") {
    const { uploadSupabase } = await import("./adapters/supabase");
    return uploadSupabase(input);
  }

  throw new Error(`Unknown STORAGE_PROVIDER: ${provider}`);
}

export async function deleteImage(url: string): Promise<void> {
  const provider = process.env.STORAGE_PROVIDER ?? "local";

  if (provider === "local") {
    const { deleteLocal } = await import("./adapters/local");
    return deleteLocal(url);
  }

  if (provider === "supabase") {
    const { deleteSupabase } = await import("./adapters/supabase");
    return deleteSupabase(url);
  }
}
