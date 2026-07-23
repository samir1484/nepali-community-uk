import { db } from "@/lib/db";
import { getAllSiteImages } from "@/lib/settings";
import { SiteImagesManager } from "@/components/admin/SiteImagesManager";
import { SocialLinksManager } from "@/components/admin/SocialLinksManager";

export default async function AdminSettingsPage() {
  const currentImages = await getAllSiteImages();
  const socialLinks = await db.socialLink.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-muted-foreground">
        Manage site-wide images and other configuration.
      </p>

      <section className="mt-8">
        <h2 className="font-semibold text-foreground">Page backgrounds</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each page has a background photo behind its content. Upload a new one to
          replace it, or remove it to fall back to the default.
        </p>
        <div className="mt-4">
          <SiteImagesManager current={currentImages} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-semibold text-foreground">Social media links</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Shown in the site footer. Add any platform — Facebook, Instagram, WhatsApp,
          TikTok, etc.
        </p>
        <div className="mt-4">
          <SocialLinksManager links={socialLinks} />
        </div>
      </section>
    </div>
  );
}
