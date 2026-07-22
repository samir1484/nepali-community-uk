import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Nepali Community UK",
  description: "Get in touch with the Nepali Community UK team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground">Get in touch</h1>
      <p className="mt-2 text-muted-foreground">
        Questions, feedback, or want to get involved? Send us a message.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
