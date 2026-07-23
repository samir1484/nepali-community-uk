import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { PageBackground } from "@/components/layout/PageBackground";

export const metadata: Metadata = { title: "My Account | Nepali Community UK" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <PageBackground image="/images/culture/mountains.jpg">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">My account</h1>
        <p className="mt-2 text-muted-foreground">
          Signed in as {session.user.name} ({session.user.email})
        </p>

        <div className="mt-8">
          <h2 className="mb-3 font-semibold text-foreground">Change password</h2>
          <ChangePasswordForm />
        </div>
      </div>
    </PageBackground>
  );
}
