import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Rooms & Housing | Nepali Community UK",
  description: "Browse room listings shared by fellow community members.",
};

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="ROOM" location={params.location} />;
}
