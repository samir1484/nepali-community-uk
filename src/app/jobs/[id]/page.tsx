import type { Metadata } from "next";
import { ListingDetailView } from "@/components/listings/ListingDetailView";
import { buildListingMetadata } from "@/lib/listingMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return buildListingMetadata("JOB", id);
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetailView type="JOB" id={id} />;
}
