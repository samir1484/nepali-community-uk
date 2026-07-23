import type { Metadata } from "next";
import { ListingDetailView } from "@/components/listings/ListingDetailView";

export const metadata: Metadata = { title: "Room | Nepali Community UK" };

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetailView type="ROOM" id={id} />;
}
