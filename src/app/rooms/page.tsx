import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/ListingsPage";

export const metadata: Metadata = {
  title: "Nepali Rooms & Housing to Rent in the UK",
  description:
    "Find rooms, flatshares and housing to rent shared by the Nepali community across the UK — single, shared, studio and whole properties, posted by fellow members.",
  alternates: { canonical: "/rooms" },
  openGraph: {
    title: "Nepali Rooms & Housing to Rent in the UK | Nepali Community UK",
    description:
      "Find rooms, flatshares and housing to rent shared by the Nepali community across the UK.",
    url: "/rooms",
  },
};

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  return <ListingsPage type="ROOM" location={params.location} />;
}
