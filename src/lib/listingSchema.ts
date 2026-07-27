import { SITE_NAME, absoluteUrl } from "@/lib/seo";
import { typeToPath, type ListingTypeValue } from "@/lib/validation/listings";
import type { JobDetails, EventDetails, BusinessDetails, RoomDetails } from "@/lib/validation/listings";

type ListingForSchema = {
  id: string;
  type: ListingTypeValue;
  title: string;
  description: string;
  location: string;
  details: unknown;
  images: string[];
  createdAt: Date;
};

/**
 * `salaryRange` is free text ("12.75", "£25,000–30,000 per year", "Negotiable"),
 * but schema.org wants a structured MonetaryAmount. Emitting a malformed value
 * makes Google reject the whole JobPosting, so only publish salary when a
 * number can be read out of it confidently.
 */
function salaryStructuredData(salaryRange: string | undefined): Record<string, unknown> {
  if (!salaryRange) return {};
  const numbers = salaryRange.match(/\d+(?:[.,]\d+)?/g);
  if (!numbers?.length) return {};

  const parsed = numbers.map((n) => Number(n.replace(/,/g, ""))).filter((n) => Number.isFinite(n));
  if (parsed.length === 0) return {};

  // Prefer an explicit unit in the text; otherwise infer from magnitude, since
  // "£12.75 per year" would be published to Google as a nonsense salary.
  const explicitlyHourly = /hour|hr\b|\/h\b/i.test(salaryRange);
  const explicitlyAnnual = /year|annum|annual|pa\b|p\/a/i.test(salaryRange);
  const isHourly = explicitlyHourly || (!explicitlyAnnual && Math.max(...parsed) < 1000);

  const value =
    parsed.length > 1
      ? { "@type": "QuantitativeValue", minValue: Math.min(...parsed), maxValue: Math.max(...parsed) }
      : { "@type": "QuantitativeValue", value: parsed[0] };

  return {
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "GBP",
      value: { ...value, unitText: isHourly ? "HOUR" : "YEAR" },
    },
  };
}

/**
 * Maps a listing onto the closest schema.org type so Google can show it as a
 * rich result (job cards, event cards, business panels).
 */
export function listingJsonLd(listing: ListingForSchema): Record<string, unknown> {
  const url = absoluteUrl(`/${typeToPath(listing.type)}/${listing.id}`);
  const images = listing.images.filter(Boolean);

  const base = {
    "@context": "https://schema.org",
    name: listing.title,
    description: listing.description,
    url,
    ...(images.length > 0 ? { image: images } : {}),
  };

  switch (listing.type) {
    case "JOB": {
      const details = listing.details as JobDetails;
      return {
        ...base,
        "@type": "JobPosting",
        title: listing.title,
        datePosted: listing.createdAt.toISOString(),
        employmentType: details.jobType,
        hiringOrganization: {
          "@type": "Organization",
          name: details.company || SITE_NAME,
        },
        jobLocation: {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressLocality: listing.location, addressCountry: "GB" },
        },
        ...salaryStructuredData(details.salaryRange),
      };
    }

    case "EVENT": {
      const details = listing.details as EventDetails;
      return {
        ...base,
        "@type": "Event",
        startDate: details.startDate,
        eventAttendanceMode: details.isOnline
          ? "https://schema.org/OnlineEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
        location: details.isOnline
          ? { "@type": "VirtualLocation", url }
          : {
              "@type": "Place",
              name: listing.location,
              address: { "@type": "PostalAddress", addressLocality: listing.location, addressCountry: "GB" },
            },
        organizer: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
        ...(details.ticketUrl
          ? { offers: { "@type": "Offer", url: details.ticketUrl, availability: "https://schema.org/InStock" } }
          : {}),
      };
    }

    case "BUSINESS": {
      const details = listing.details as BusinessDetails;
      return {
        ...base,
        "@type": "LocalBusiness",
        address: { "@type": "PostalAddress", addressLocality: listing.location, addressCountry: "GB" },
        ...(details.websiteUrl ? { sameAs: [details.websiteUrl] } : {}),
        ...(details.services ? { knowsAbout: details.services } : {}),
      };
    }

    case "ROOM": {
      const details = listing.details as RoomDetails;
      return {
        ...base,
        "@type": "Accommodation",
        address: { "@type": "PostalAddress", addressLocality: listing.location, addressCountry: "GB" },
        ...(details.rentAmount
          ? {
              potentialAction: {
                "@type": "RentAction",
                price: details.rentAmount,
                priceCurrency: "GBP",
              },
            }
          : {}),
      };
    }

    case "VOLUNTEER":
      return {
        ...base,
        "@type": "Article",
        headline: listing.title,
        datePublished: listing.createdAt.toISOString(),
        publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
      };
  }
}
