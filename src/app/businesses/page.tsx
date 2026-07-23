import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Business Directory | Nepali Community UK",
  description: "Discover and support Nepali-owned businesses across the UK.",
};

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="BUSINESS" location={params.location} />;
}
