const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.8;

/**
 * Resizes + re-encodes an image client-side before upload. Uploads to Supabase
 * Storage were timing out on Vercel for large phone-camera photos (several MB) —
 * shrinking to a reasonable max dimension and re-encoding as JPEG cuts typical
 * file sizes by 80-95%, which keeps uploads well under the function timeout.
 * GIFs pass through untouched (canvas would flatten animation to one frame).
 */
export async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  if (!blob || blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}
