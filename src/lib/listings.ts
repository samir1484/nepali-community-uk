import type { ListingTypeValue } from "@/lib/validation/listings";
import type {
  JobDetails,
  RoomDetails,
  EventDetails,
  VolunteerDetails,
  BusinessDetails,
} from "@/lib/validation/listings";

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  TEMPORARY: "Temporary",
  INTERNSHIP: "Internship",
};

const ROOM_TYPE_LABELS: Record<string, string> = {
  SINGLE: "Single room",
  SHARED: "Shared room",
  STUDIO: "Studio",
  WHOLE_PROPERTY: "Whole property",
};

export function formatListingTeaser(type: ListingTypeValue, details: unknown): string {
  switch (type) {
    case "JOB": {
      const d = details as JobDetails;
      return [d.company, JOB_TYPE_LABELS[d.jobType] ?? d.jobType].filter(Boolean).join(" · ");
    }
    case "ROOM": {
      const d = details as RoomDetails;
      const period = d.rentPeriod === "WEEKLY" ? "week" : "month";
      return `£${d.rentAmount}/${period} · ${ROOM_TYPE_LABELS[d.roomType] ?? d.roomType}`;
    }
    case "EVENT": {
      const d = details as EventDetails;
      return [formatDate(d.startDate), d.isOnline ? "Online" : null].filter(Boolean).join(" · ");
    }
    case "VOLUNTEER": {
      const d = details as VolunteerDetails;
      return [d.organization, d.commitment].filter(Boolean).join(" · ");
    }
    case "BUSINESS": {
      const d = details as BusinessDetails;
      return d.services;
    }
  }
}

export function formatListingDetailRows(
  type: ListingTypeValue,
  details: unknown
): { label: string; value: string; href?: string }[] {
  switch (type) {
    case "JOB": {
      const d = details as JobDetails;
      return [
        { label: "Company", value: d.company },
        { label: "Job type", value: JOB_TYPE_LABELS[d.jobType] ?? d.jobType },
        ...(d.salaryRange ? [{ label: "Salary", value: d.salaryRange }] : []),
        ...(d.applyEmail ? [{ label: "Apply via", value: d.applyEmail }] : []),
      ];
    }
    case "ROOM": {
      const d = details as RoomDetails;
      const period = d.rentPeriod === "WEEKLY" ? "week" : "month";
      return [
        { label: "Rent", value: `£${d.rentAmount} / ${period}` },
        { label: "Room type", value: ROOM_TYPE_LABELS[d.roomType] ?? d.roomType },
        ...(d.availableFrom ? [{ label: "Available from", value: formatDate(d.availableFrom) }] : []),
      ];
    }
    case "EVENT": {
      const d = details as EventDetails;
      return [
        { label: "Date", value: formatDate(d.startDate) },
        { label: "Format", value: d.isOnline ? "Online" : "In person" },
      ];
    }
    case "VOLUNTEER": {
      const d = details as VolunteerDetails;
      return [
        { label: "Organization", value: d.organization },
        { label: "Time commitment", value: d.commitment },
      ];
    }
    case "BUSINESS": {
      const d = details as BusinessDetails;
      return [
        { label: "Services", value: d.services },
        ...(d.websiteUrl ? [{ label: "Website", value: d.websiteUrl, href: d.websiteUrl }] : []),
      ];
    }
  }
}

/** Google Maps embed URL for an address, using no-API-key iframe embed mode. */
export function mapsEmbedUrl(location: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
}

/** Google Maps search link for an address, for a "view larger map" link. */
export function mapsSearchUrl(location: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
