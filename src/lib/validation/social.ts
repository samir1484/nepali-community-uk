import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(2, "Platform name is required"),
  url: z.string().trim().url("Enter a valid URL (including https://)"),
  order: z.coerce.number().int(),
  isActive: z.coerce.boolean(),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
