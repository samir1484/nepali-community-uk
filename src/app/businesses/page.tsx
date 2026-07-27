import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Nepali Business Directory UK",
  description:
    "Discover and support Nepali-owned businesses across the UK — restaurants, shops, services and professionals listed by the community, with locations and contact details.",
  alternates: { canonical: "/businesses" },
  openGraph: {
    title: "Nepali Business Directory UK | Nepali Community UK",
    description: "Discover and support Nepali-owned businesses across the UK.",
    url: "/businesses",
  },
};

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="BUSINESS" location={params.location} />;
}
