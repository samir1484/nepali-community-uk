import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { PageBackground } from "@/components/layout/PageBackground";
import { getSiteImage } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Forgot your password",
  description: "Reset the password for your Nepali Community UK account.",
  robots: { index: false, follow: true },
};

export default async function ForgotPasswordPage() {
  const backgroundImage = await getSiteImage("page.login.image", "/images/hero/hero-bg.jpg");

  return (
    <PageBackground image={backgroundImage}>
      <div className="mx-auto w-full max-w-md px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground">Forgot your password?</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your email and we&apos;ll send you a link to choose a new one.
        </p>
        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </PageBackground>
  );
}
