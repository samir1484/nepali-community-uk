import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { GameButton } from "@/components/layout/GameButton";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { getSiteImage } from "@/lib/settings";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Nepali Jobs, Rooms, Events & Businesses in the UK`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Nepali community UK",
    "Nepali jobs UK",
    "Nepali rooms to rent",
    "Nepali events UK",
    "Nepali business directory",
    "Nepali diaspora UK",
    "Nepalese community United Kingdom",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Nepali Jobs, Rooms, Events & Businesses in the UK`,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1600, height: 900, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Nepali Jobs, Rooms, Events & Businesses in the UK`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Belt-and-braces alongside the DNS TXT record: keeps Search Console
  // ownership verified even if the domain's DNS is changed later.
  verification: {
    google: "nfl7sZgX_8F_J8rKhjfrr5kBgKxMJEqwhfZe5_IJIA0",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Admin-editable from Settings, falling back to the bundled photo.
  const chatAvatar = await getSiteImage("chat.avatar.image", "/images/chat/assistant.png");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansDevanagari.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: absoluteUrl("/logo.png"),
            description: DEFAULT_DESCRIPTION,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
          }}
        />
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <GameButton />
          <ChatWidget avatarSrc={chatAvatar} />
          {/* Top-centre because the chat panel now occupies the bottom-right,
              where sonner would otherwise render toasts underneath it. */}
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
