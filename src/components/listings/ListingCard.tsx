import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatListingTeaser } from "@/lib/listings";
import type { ListingTypeValue } from "@/lib/validation/listings";

export function ListingCard({
  id,
  type,
  title,
  location,
  details,
  images,
  createdAt,
}: {
  id: string;
  type: ListingTypeValue;
  title: string;
  location: string;
  details: unknown;
  images: string[];
  createdAt: Date;
}) {
  const path = type === "JOB" ? "jobs" : type === "ROOM" ? "rooms" : type === "EVENT" ? "events" : "volunteer";

  return (
    <Link href={`/${path}/${id}`}>
      <Card className="h-full transition-colors hover:border-primary">
        {images[0] && (
          <Image
            src={images[0]}
            alt=""
            width={640}
            height={360}
            className="h-40 w-full object-cover"
          />
        )}
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
