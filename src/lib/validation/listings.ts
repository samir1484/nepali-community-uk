import { z } from "zod";

export const LISTING_TYPES = ["JOB", "ROOM", "EVENT", "VOLUNTEER", "BUSINESS"] as const;
export type ListingTypeValue = (typeof LISTING_TYPES)[number];

export const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY", "INTERNSHIP"] as const;
export const ROOM_TYPES = ["SINGLE", "SHARED", "STUDIO", "WHOLE_PROPERTY"] as const;
export const RENT_PERIODS = ["WEEKLY", "MONTHLY"] as const;

/**
 * Only http(s) links are accepted anywhere a member can submit a URL — this is
 * what stops a `javascript:` or `data:` URL being saved and later rendered as a
 * clickable link.
 */
export const externalUrlSchema = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || /^https?:\/\/[^\s]+\.[^\s]+/i.test(v),
    "Enter a valid link starting with http:// or https://"
  )
  .optional()
  .or(z.literal(""));

export const listingBaseSchema = z.object({
  type: z.enum(LISTING_TYPES),
  title: z.string().trim().min(3, "Title is required"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  location: z.string().trim().min(2, "Location is required"),
  externalUrl: externalUrlSchema,
});

export const jobDetailsSchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  jobType: z.enum(JOB_TYPES),
  salaryRange: z.string().trim().optional().or(z.literal("")),
  applyEmail: z.string().trim().toLowerCase().email("Enter a valid email").optional().or(z.literal("")),
});

export const roomDetailsSchema = z.object({
  rentAmount: z.coerce.number().positive("Enter a valid rent amount"),
  rentPeriod: z.enum(RENT_PERIODS),
  roomType: z.enum(ROOM_TYPES),
  availableFrom: z.string().trim().optional().or(z.literal("")),
});

export const eventDetailsSchema = z.object({
  startDate: z.string().trim().min(1, "Start date is required"),
  isOnline: z.coerce.boolean().optional().default(false),
  ticketUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/.+\..+/.test(v), "Enter a valid URL (starting with http:// or https://)")
    .optional()
    .or(z.literal("")),
});

export const volunteerDetailsSchema = z.object({
  organization: z.string().trim().min(1, "Organization is required"),
  commitment: z.string().trim().min(1, "Time commitment is required"),
});

export const businessDetailsSchema = z.object({
  services: z.string().trim().min(1, "Describe the services offered"),
  websiteUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/.+\..+/.test(v), "Enter a valid URL (starting with http:// or https://)")
    .optional()
    .or(z.literal("")),
});

export function detailsSchemaFor(type: ListingTypeValue) {
  switch (type) {
    case "JOB":
      return jobDetailsSchema;
    case "ROOM":
      return roomDetailsSchema;
    case "EVENT":
      return eventDetailsSchema;
    case "VOLUNTEER":
      return volunteerDetailsSchema;
    case "BUSINESS":
      return businessDetailsSchema;
  }
}

export type JobDetails = z.infer<typeof jobDetailsSchema>;
export type RoomDetails = z.infer<typeof roomDetailsSchema>;
export type EventDetails = z.infer<typeof eventDetailsSchema>;
export type VolunteerDetails = z.infer<typeof volunteerDetailsSchema>;
export type BusinessDetails = z.infer<typeof businessDetailsSchema>;

const TYPE_PATHS: Record<ListingTypeValue, string> = {
  JOB: "jobs",
  ROOM: "rooms",
  EVENT: "events",
  VOLUNTEER: "volunteer",
  BUSINESS: "businesses",
};

export function typeToPath(type: ListingTypeValue): string {
  return TYPE_PATHS[type];
}

const TYPE_LABELS: Record<ListingTypeValue, string> = {
  JOB: "Job",
  ROOM: "Room",
  EVENT: "Event",
  VOLUNTEER: "Volunteer opportunity",
  BUSINESS: "Business",
};

export function typeLabel(type: ListingTypeValue): string {
  return TYPE_LABELS[type];
}

const TYPE_PLURAL_LABELS: Record<ListingTypeValue, string> = {
  JOB: "jobs",
  ROOM: "rooms",
  EVENT: "events",
  VOLUNTEER: "volunteer opportunities",
  BUSINESS: "businesses",
};

export function typePluralLabel(type: ListingTypeValue): string {
  return TYPE_PLURAL_LABELS[type];
}

/** What the shared `externalUrl` field is actually for, per listing type. */
const TYPE_URL_LABELS: Record<ListingTypeValue, string> = {
  JOB: "Application link",
  ROOM: "Listing link",
  EVENT: "More info link",
  VOLUNTEER: "Sign-up link",
  BUSINESS: "Booking or menu link",
};

export function typeUrlLabel(type: ListingTypeValue): string {
  return TYPE_URL_LABELS[type];
}

const TYPE_URL_CTA: Record<ListingTypeValue, string> = {
  JOB: "Apply online",
  ROOM: "View listing",
  EVENT: "More information",
  VOLUNTEER: "Sign up",
  BUSINESS: "Visit link",
};

export function typeUrlCta(type: ListingTypeValue): string {
  return TYPE_URL_CTA[type];
}

const TYPE_BACKGROUND_IMAGES: Record<ListingTypeValue, string> = {
  JOB: "/images/culture/temple.jpg",
  ROOM: "/images/culture/mountains.jpg",
  EVENT: "/images/culture/festival.jpg",
  VOLUNTEER: "/images/culture/tradition.jpg",
  BUSINESS: "/images/culture/khukuri.webp",
};

export function typeBackgroundImage(type: ListingTypeValue): string {
  return TYPE_BACKGROUND_IMAGES[type];
}
