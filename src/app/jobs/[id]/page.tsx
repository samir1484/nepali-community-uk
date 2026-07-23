import type { Metadata } from "next";
import { ListingDetailView } from "@/components/listings/ListingDetailView";

export const metadata: Metadata = { title: "Job | Nepali Community UK" };

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetailView type="JOB" id={id} />;
}
