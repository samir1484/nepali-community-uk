import type { Metadata } from "next";
import { ListingDetailView } from "@/components/listings/ListingDetailView";
import { buildListingMetadata } from "@/lib/listingMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return buildListingMetadata("VOLUNTEER", id);
}

export default async function VolunteerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetailView type="VOLUNTEER" id={id} />;
}
