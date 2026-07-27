import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { PageBackground } from "@/components/layout/PageBackground";
import { getSiteImage } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Nepali Community UK team — questions, partnership enquiries, or help with posting a job, room, event or business listing.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Us | Nepali Community UK", url: "/contact" },
};

export default async function ContactPage() {
  const backgroundImage = await getSiteImage("page.contact.image", "/images/culture/festival.jpg");

  return (
    <PageBackground image={backgroundImage}>
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">Get in touch</h1>
        <p className="mt-2 text-muted-foreground">
          Questions, feedback, or want to get involved? Send us a message.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </PageBackground>
  );
}
