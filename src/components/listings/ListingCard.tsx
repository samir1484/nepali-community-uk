import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatListingTeaser } from "@/lib/listings";
import type { ListingTypeValue } from "@/lib/validation/listings";

export function ListingCard({
  id,
  type,
  title,
  location,
  details,
  createdAt,
}: {
  id: string;
  type: ListingTypeValue;
  title: string;
  location: string;
  details: unknown;
  createdAt: Date;
}) {
  const path = type === "JOB" ? "jobs" : type === "ROOM" ? "rooms" : type === "EVENT" ? "events" : "volunteer";

  return (
    <Link href={`/${path}/${id}`}>
      <Card className="h-full transition-colors hover:border-primary">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{formatListingTeaser(type, details)}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{location}</span>
            <span>{createdAt.toLocaleDateString("en-GB")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
