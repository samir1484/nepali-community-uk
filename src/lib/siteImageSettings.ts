export const IMAGE_SETTINGS = [
  { key: "page.about.image", label: "About page background", default: "/images/culture/mountains.jpg" },
  { key: "page.founder.background", label: "Founder page background", default: "/images/culture/tradition.jpg" },
  { key: "founder.imageUrl", label: "Founder profile photo", default: "" },
  { key: "page.contact.image", label: "Contact page background", default: "/images/culture/festival.jpg" },
  { key: "page.login.image", label: "Login page background", default: "/images/hero/hero-bg.jpg" },
  { key: "page.register.image", label: "Register page background", default: "/images/hero/hero-bg.jpg" },
  { key: "listing.JOB.image", label: "Jobs page background", default: "/images/culture/temple.jpg" },
  { key: "listing.ROOM.image", label: "Rooms page background", default: "/images/culture/mountains.jpg" },
  { key: "listing.EVENT.image", label: "Events page background", default: "/images/culture/festival.jpg" },
  { key: "listing.VOLUNTEER.image", label: "Volunteer page background", default: "/images/culture/tradition.jpg" },
  { key: "listing.BUSINESS.image", label: "Business Directory page background", default: "/images/culture/khukuri.webp" },
  { key: "page.news.image", label: "News & Blog page background", default: "/images/culture/stupa-alt.webp" },
  { key: "page.advertise.image", label: "Advertise page background", default: "/images/culture/festival.jpg" },
] as const;

export type ImageSettingKey = (typeof IMAGE_SETTINGS)[number]["key"];
