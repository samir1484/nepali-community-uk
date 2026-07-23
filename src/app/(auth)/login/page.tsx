import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { PageBackground } from "@/components/layout/PageBackground";
import { getSiteImage } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Log in | Nepali Community UK",
  description: "Log in to your Nepali Community UK account.",
};

export default async function LoginPage() {
  const backgroundImage = await getSiteImage("page.login.image", "/images/hero/hero-bg.jpg");

  return (
    <PageBackground image={backgroundImage}>
      <div className="mx-auto w-full max-w-md px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Log in to your account.</p>
        <div className="mt-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </PageBackground>
  );
}
