"use server";

import { requireAdmin } from "@/lib/auth/rbac";
import { uploadImage, validateImageUpload } from "@/lib/storage";

export type UploadActionState = {
  success: boolean;
  url?: string;
  error?: string;
};

export async function uploadSectionImage(formData: FormData): Promise<UploadActionState> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file selected." };
  }

  const validationError = validateImageUpload({ size: file.size, type: file.type });
  if (validationError) {
    return { success: false, error: validationError };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await uploadImage({ buffer, filename: file.name, mimeType: file.type });

  return { success: true, url };
}
