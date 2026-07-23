import { z } from "zod";

export const SECTION_TYPES = ["HIGHLIGHT", "SHOWCASE"] as const;

export const sectionSchema = z.object({
  type: z.enum(SECTION_TYPES),
  title: z.string().trim().min(2, "Title is required"),
  caption: z.string().trim().optional().or(z.literal("")),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  order: z.coerce.number().int(),
  isActive: z.coerce.boolean(),
});

export type SectionInput = z.infer<typeof sectionSchema>;
