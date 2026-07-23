import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Full-bleed page background photo with a strong tint overlay so text and
 * buttons on top always stay fully legible — the photo reads as a subtle
 * texture, not a loud hero image.
 */
export function PageBackground({
  image,
  children,
}: {
  image: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <Image src={image} alt="" fill priority={false} className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-background/92" aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  );
}
