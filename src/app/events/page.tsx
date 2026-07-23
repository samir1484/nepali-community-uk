import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Events | Nepali Community UK",
  description: "Nepali cultural events, festivals, and meetups across the UK.",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="EVENT" location={params.location} />;
}
