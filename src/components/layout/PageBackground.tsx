import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Full-bleed page background photo with a tint overlay so text and buttons
 * on top stay fully legible while the photo is still clearly visible.
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
      <div className="absolute inset-0 bg-background/80" aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  );
}
