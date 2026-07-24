"use client";

import { useState, useTransition } from "react";
import { updateProfilePhoto } from "@/lib/actions/account";
import { uploadUserImage } from "@/lib/actions/uploads";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function ProfilePhotoUploader({ initialImage }: { initialImage: string }) {
  const [image, setImage] = useState(initialImage);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleChange(url: string) {
    setImage(url);
    startTransition(async () => {
      await updateProfilePhoto(url);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="space-y-2">
      <ImageUploader value={image} onChange={handleChange} uploadAction={uploadUserImage} />
      <p className="text-xs text-muted-foreground">
        {isPending ? "Saving..." : saved ? "Saved" : "Helps other members recognise you when you post a listing."}
      </p>
    </div>
  );
}
