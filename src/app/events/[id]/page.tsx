import type { Metadata } from "next";
import { ListingDetailView } from "@/components/listings/ListingDetailView";

export const metadata: Metadata = { title: "Event | Nepali Community UK" };

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetailView type="EVENT" id={id} />;
}
