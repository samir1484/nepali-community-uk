import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { isResetTokenValid } from "@/lib/actions/passwordReset";
import { PageBackground } from "@/components/layout/PageBackground";
import { getSiteImage } from "@/lib/settings";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Choose a new password",
  // A reset link must never end up in search results or be followed by a
  // crawler, which would burn the single-use token.
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const backgroundImage = await getSiteImage("page.login.image", "/images/hero/hero-bg.jpg");
  const valid = await isResetTokenValid(token);

  return (
    <PageBackground image={backgroundImage}>
      <div className="mx-auto w-full max-w-md px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground">Choose a new password</h1>

        {valid ? (
          <>
            <p className="mt-2 text-muted-foreground">
              Pick something you&apos;ll remember — you&apos;ll use it to log in from now on.
            </p>
            <div className="mt-8">
              <ResetPasswordForm token={token} />
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-lg border bg-card p-6">
            <p className="font-medium text-foreground">This link is no longer valid</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reset links work once and expire after an hour. Request a fresh one and
              we&apos;ll email it straight over.
            </p>
            <Button
              className="mt-4"
              nativeButton={false}
              render={<Link href="/forgot-password">Request a new link</Link>}
            />
          </div>
        )}
      </div>
    </PageBackground>
  );
}
