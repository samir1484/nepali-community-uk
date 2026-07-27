import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Nepali Events & Festivals in the UK",
  description:
    "Discover Nepali cultural events, festivals, Dashain and Tihar celebrations, and community meetups happening across the United Kingdom.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Nepali Events & Festivals in the UK | Nepali Community UK",
    description:
      "Discover Nepali cultural events, festivals and community meetups across the United Kingdom.",
    url: "/events",
  },
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="EVENT" location={params.location} />;
}
