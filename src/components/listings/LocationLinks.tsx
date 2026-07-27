import Link from "next/link";
import { UK_LOCATIONS } from "@/lib/locations";
import { typePluralLabel, typeToPath, type ListingTypeValue } from "@/lib/validation/listings";

/**
 * Cross-links every location page for a listing type. Internal links are how
 * these landing pages get crawled and how they pass ranking signal to each
 * other — without this block they'd be orphan pages Google never reaches.
 */
export function LocationLinks({
  type,
  currentSlug,
}: {
  type: ListingTypeValue;
  currentSlug?: string;
}) {
  const path = typeToPath(type);

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Browse {typePluralLabel(type)} by location
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {UK_LOCATIONS.map((location) => {
          const isCurrent = location.slug === currentSlug;
          return (
            <li key={location.slug}>
              {isCurrent ? (
                <span className="inline-block rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {location.name}
                </span>
              ) : (
                <Link
                  href={`/${path}/in/${location.slug}`}
                  className="inline-block rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {location.name}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
