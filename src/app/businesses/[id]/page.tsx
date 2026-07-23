import type { Metadata } from "next";
import { ListingDetailView } from "@/components/listings/ListingDetailView";

export const metadata: Metadata = { title: "Business | Nepali Community UK" };

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetailView type="BUSINESS" id={id} />;
}
