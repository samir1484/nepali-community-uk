"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Listing } from "@/generated/prisma/client";
import { approveListing, rejectListing, deleteListing } from "@/lib/actions/listings";
import { formatListingTeaser } from "@/lib/listings";
import { typeLabel, typeToPath, LISTING_TYPES, type ListingTypeValue } from "@/lib/validation/listings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type ListingWithAuthor = Listing & { author: { name: string; email: string } };

const STATUS_TABS = ["PENDING", "APPROVED", "REJECTED", "ALL"] as const;
const TYPE_TABS = ["ALL", ...LISTING_TYPES] as const;

export function ListingsManager({ listings }: { listings: ListingWithAuthor[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_TABS)[number]>("PENDING");
  const [typeFilter, setTypeFilter] = useState<(typeof TYPE_TABS)[number]>("ALL");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
      if (typeFilter !== "ALL" && l.type !== typeFilter) return false;
      return true;
    });
  }, [listings, statusFilter, typeFilter]);

  function run(action: () => Promise<{ success: boolean; message: string }>) {
    startTransition(async () => {
      const result = await action();
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {LISTING_TYPES.map((t) => (
          <Button key={t} size="sm" variant="outline" nativeButton={false} render={<Link href={`/${typeToPath(t)}/new`}>+ {typeLabel(t)}</Link>} />
        ))}
      </div>

      {message && (
        <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {TYPE_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                typeFilter === t
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t === "ALL" ? "All types" : typeLabel(t as ListingTypeValue)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No listings match this filter.</p>
        )}
        {filtered.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{typeLabel(listing.type)}</Badge>
                  <Badge
                    variant={
                      listing.status === "APPROVED"
                        ? "default"
                        : listing.status === "REJECTED"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {listing.status}
                  </Badge>
                </div>
                <p className="mt-1 truncate font-medium text-foreground">{listing.title}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {formatListingTeaser(listing.type, listing.details)} · {listing.location}
                </p>
                <p className="text-xs text-muted-foreground">
                  Posted by {listing.author.name} ({listing.author.email})
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {listing.status !== "APPROVED" && (
                  <Button
                    size="sm"
                    disabled={isPending}
                    onClick={() => run(() => approveListing(listing.id))}
                  >
                    Approve
                  </Button>
                )}
                {listing.status !== "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => run(() => rejectListing(listing.id))}
                  >
                    Reject
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => {
                    if (window.confirm(`Delete "${listing.title}"?`)) {
                      run(() => deleteListing(listing.id));
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
