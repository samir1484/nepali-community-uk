"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NepaliBoyAvatar } from "./NepaliBoyAvatar";

/**
 * The assistant's face: a photo of a boy in dhaka topi and daura, cropped to a
 * head-and-shoulders square (the original was a wide full-body shot, which
 * showed only his waist once clipped to a circle).
 *
 * The photo has a transparent background, so the container supplies a warm
 * cream fill rather than letting the page show through the cutout. Falls back
 * to the hand-drawn SVG if the file ever goes missing, so a renamed asset
 * can't leave a broken image on every page.
 */
export function ChatAvatar({
  src,
  className,
  px,
}: {
  src: string;
  className?: string;
  px: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return <NepaliBoyAvatar className={className} />;

  return (
    <span
      className={cn("inline-block overflow-hidden rounded-full bg-[#f4ede3]", className)}
    >
      <Image
        src={src}
        alt="Nepali Community UK assistant"
        width={px}
        height={px}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
        priority={px >= 56}
      />
    </span>
  );
}
