import type { Metadata } from "next";
import { ListingDetailView } from "@/components/listings/ListingDetailView";

export const metadata: Metadata = { title: "Volunteer Opportunity | Nepali Community UK" };

export default async function VolunteerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetailView type="VOLUNTEER" id={id} />;
}
