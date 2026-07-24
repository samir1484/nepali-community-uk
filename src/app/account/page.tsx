import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { ProfilePhotoUploader } from "@/components/account/ProfilePhotoUploader";
import { ProfileDetailsForm } from "@/components/account/ProfileDetailsForm";
import { PageBackground } from "@/components/layout/PageBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = { title: "My Account | Nepali Community UK" };

// Profile photo upload goes to Supabase Storage — safety margin against
// Vercel's default function timeout on a cold start.
export const maxDuration = 30;

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login?callbackUrl=/account");

  return (
    <PageBackground image="/images/culture/mountains.jpg">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">My account</h1>
        <p className="mt-2 text-muted-foreground">
          Signed in as {user.name} ({user.email})
        </p>

        <Tabs defaultValue="profile" className="mt-8">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 space-y-6">
            <div>
              <h2 className="mb-3 font-semibold text-foreground">Profile photo</h2>
              <ProfilePhotoUploader initialImage={user.image ?? ""} />
            </div>

            <div>
              <h2 className="mb-3 font-semibold text-foreground">Profile details</h2>
              <ProfileDetailsForm
                initialName={user.name}
                initialEmail={user.email}
                initialPhone={user.phone ?? ""}
                initialLocation={user.location ?? ""}
                initialInterests={user.interests}
              />
            </div>
          </TabsContent>

          <TabsContent value="password" className="mt-4">
            <h2 className="mb-3 font-semibold text-foreground">Change password</h2>
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </PageBackground>
  );
}
