"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { X, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadUserImage } from "@/lib/actions/uploads";
import { compressImage } from "@/lib/imageCompression";

const MAX_IMAGES = 6;

export function ListingImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const remainingSlots = MAX_IMAGES - value.length;
    const selected = Array.from(files).slice(0, remainingSlots);
    if (selected.length === 0) {
      setError(`You can add up to ${MAX_IMAGES} photos.`);
      return;
    }

    startTransition(async () => {
      const uploaded: string[] = [];
      for (const file of selected) {
        const compressed = await compressImage(file);
        const formData = new FormData();
        formData.set("file", compressed);
        const result = await uploadUserImage(formData);
        if (result.success && result.url) {
          uploaded.push(result.url);
        } else {
          setError(result.error ?? "Upload failed.");
        }
      }
      if (uploaded.length > 0) onChange([...value, ...uploaded]);
    });
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className="space-y-2">
      {value.map((url) => (
        <input key={url} type="hidden" name="images" value={url} />
      ))}

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-md border">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending || value.length >= MAX_IMAGES}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <Upload size={14} /> Add photos
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">
        Optional — up to {MAX_IMAGES} photos ({value.length}/{MAX_IMAGES}).
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
