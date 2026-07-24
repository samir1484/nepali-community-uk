import type { ReactNode } from "react";
import { ParallaxImage } from "@/components/animation/AnimatedSection";

/**
 * Full-bleed page background photo (with the same scroll-parallax drift and
 * quality as the homepage's Heritage & Culture showcase) plus a tint overlay
 * so text and buttons on top stay fully legible while the photo is visible.
 */
export function PageBackground({
  image,
  children,
}: {
  image: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <ParallaxImage src={image} alt="" />
      <div className="absolute inset-0 bg-background/80" aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  );
}
