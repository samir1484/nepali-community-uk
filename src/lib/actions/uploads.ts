"use server";

import { auth } from "@/auth";
import { requireAdmin, NotAuthorizedError } from "@/lib/auth/rbac";
import { uploadImage, validateImageUpload } from "@/lib/storage";

export type UploadActionState = {
  success: boolean;
  url?: string;
  error?: string;
};

async function uploadFromFormData(formData: FormData): Promise<UploadActionState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file selected." };
  }

  const validationError = validateImageUpload({ size: file.size, type: file.type });
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await uploadImage({ buffer, filename: file.name, mimeType: file.type });
    return { success: true, url };
  } catch (err) {
    // TEMP DEBUG: surface the real error instead of a generic digest.
    const message = err instanceof Error ? `${err.name}: ${err.message}\n${err.stack}` : String(err);
    return { success: false, error: "DEBUG: " + message };
  }
}

export async function uploadSectionImage(formData: FormData): Promise<UploadActionState> {
  await requireAdmin();
  return uploadFromFormData(formData);
}

/** Any logged-in user can upload a photo to attach to their own listing. */
export async function uploadUserImage(formData: FormData): Promise<UploadActionState> {
  const session = await auth();
  if (!session?.user) throw new NotAuthorizedError();
  return uploadFromFormData(formData);
}
