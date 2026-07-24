"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { X, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadSectionImage, type UploadActionState } from "@/lib/actions/uploads";
import { compressImage } from "@/lib/imageCompression";

export function ImageUploader({
  value,
  onChange,
  uploadAction = uploadSectionImage,
}: {
  value: string;
  onChange: (url: string) => void;
  uploadAction?: (formData: FormData) => Promise<UploadActionState>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFileSelected(file: File | undefined) {
    if (!file) return;
    setError(null);

    startTransition(async () => {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.set("file", compressed);

      const result = await uploadAction(formData);
      if (!result.success || !result.url) {
        setError(result.error ?? "Upload failed.");
        return;
      }
      onChange(result.url);
    });
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative h-40 w-full overflow-hidden rounded-md border">
          <Image src={value} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
          No image selected
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <Upload size={14} /> {value ? "Replace image" : "Upload image"}
          </>
        )}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
