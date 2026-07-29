import { z } from "zod";
import { externalUrlSchema } from "@/lib/validation/listings";

export const AD_PLACEMENTS = ["HOMEPAGE", "JOBS", "ROOMS", "EVENTS", "BUSINESSES", "NEWS"] as const;
export type AdPlacementValue = (typeof AD_PLACEMENTS)[number];

export const AD_PLACEMENT_LABELS: Record<AdPlacementValue, string> = {
  HOMEPAGE: "Homepage",
  JOBS: "Jobs page",
  ROOMS: "Rooms & Housing page",
  EVENTS: "Events page",
  BUSINESSES: "Business Directory page",
  NEWS: "News & Blog page",
};

export const advertSchema = z.object({
  placement: z.enum(AD_PLACEMENTS),
  title: z.string().trim().min(2, "Title is required"),
  body: z.string().trim().max(300, "Keep it under 300 characters").optional().or(z.literal("")),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  linkUrl: externalUrlSchema,
  order: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

export type AdvertInput = z.infer<typeof advertSchema>;
