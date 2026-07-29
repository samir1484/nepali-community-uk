import type { Metadata } from "next";
import { AdvertiseOptions } from "./AdvertiseOptions";
import { PageBackground } from "@/components/layout/PageBackground";
import { getSiteImage } from "@/lib/settings";
import { np } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Advertise With Us",
  description:
    "Reach thousands of Nepali people across the UK. Promote your business, event or service to an engaged Nepali community audience through Nepali Community UK.",
  alternates: { canonical: "/advertise" },
  openGraph: {
    title: "Advertise With Us | Nepali Community UK",
    description: "Promote your business, event or service to the Nepali community across the UK.",
    url: "/advertise",
  },
};

export default async function AdvertisePage() {
  const backgroundImage = await getSiteImage("page.advertise.image", "/images/culture/festival.jpg");

  return (
    <PageBackground image={backgroundImage}>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">
          Advertise With Us{" "}
          <span className="font-nepali text-2xl text-muted-foreground">{np.advertiseHeading}</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Nepali Community UK connects Nepali people across the United Kingdom — students,
          families, professionals and business owners. If you want to reach them, we&apos;d
          love to hear from you.
        </p>

        <AdvertiseOptions />
      </div>
    </PageBackground>
  );
}
