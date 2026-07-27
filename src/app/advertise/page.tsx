import type { Metadata } from "next";
import { AdvertiseForm } from "./AdvertiseForm";
import { Card, CardContent } from "@/components/ui/card";
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

const OPTIONS = [
  {
    title: "Featured business listing",
    description:
      "Get your business pinned to the top of the Business Directory, with photos, services and a link to your own website.",
  },
  {
    title: "Event promotion",
    description:
      "Put your event in front of members who have told us they're interested in Nepali events — including an email alert when it goes live.",
  },
  {
    title: "Sponsored article",
    description:
      "Tell your story properly with a dedicated post in our News & Blog section, shareable across the community.",
  },
  {
    title: "Homepage placement",
    description:
      "A banner or highlight card on the homepage, seen by everyone who visits Nepali Community UK.",
  },
];

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

        <h2 className="mt-10 text-xl font-semibold text-foreground">Ways to work with us</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <Card key={option.title} className="h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground">{option.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Pricing depends on what you need and how long you&apos;d like to run it — tell us
          what you have in mind and we&apos;ll come back with options. We&apos;re happy to
          work with small local businesses as well as larger organisations.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">Get in touch</h2>
        <div className="mt-4">
          <AdvertiseForm />
        </div>
      </div>
    </PageBackground>
  );
}
