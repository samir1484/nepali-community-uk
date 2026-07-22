"use client";

import { motion, useScroll, useTransform, type Variants, type HTMLMotionProps } from "framer-motion";
import { useRef, type ReactNode } from "react";
import Image from "next/image";

/**
 * The ONLY file in this project that imports framer-motion directly.
 * Every scroll-reveal / parallax effect should compose these components
 * rather than importing motion.* elsewhere, so a "forgot use client"
 * mistake can only ever exist here.
 */

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

interface AnimatedSectionProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "viewport"> {
  delay?: number;
  variants?: Variants;
}

export function AnimatedSection({
  children,
  delay = 0,
  variants = defaultVariants,
  transition,
  ...props
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: "easeOut", ...transition }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay } },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={defaultVariants} transition={{ duration: 0.5, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/** A background photo that drifts slower than the page scroll, for a subtle parallax feel. */
export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
      </motion.div>
    </div>
  );
}
