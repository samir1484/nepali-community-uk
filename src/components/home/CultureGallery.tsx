import Image from "next/image";
import { firstExistingPublicFile } from "@/lib/media";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

const CULTURE_ITEMS = [
  {
    slug: "mountains",
    title: "The Himalayas",
    caption: "Home to eight of the world's ten highest peaks, including Sagarmatha.",
  },
  {
    slug: "khukuri",
    title: "The Gurkha Khukuri",
    caption: "A symbol of Gurkha courage and centuries of proud military tradition.",
  },
  {
    slug: "stupa",
    title: "Sacred Stupas",
    caption: "Boudhanath and Swayambhunath stand among the world's holiest Buddhist sites.",
  },
  {
    slug: "festival",
    title: "Festivals & Tradition",
    caption: "From Dashain to Tihar, celebrations that bring the community together.",
  },
  {
    slug: "temple",
    title: "Sacred Temples",
    caption: "Pashupatinath and countless other temples anchor Nepal's spiritual life.",
  },
  {
    slug: "tradition",
    title: "Living Culture",
    caption: "Traditions like the Kumari carry Nepal's heritage into every generation.",
  },
] as const;

function candidatePaths(slug: string) {
  return EXTENSIONS.map((ext) => `images/culture/${slug}.${ext}`);
}

export function CultureGallery() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-2xl font-bold text-foreground">
        Nepali Heritage &amp; Culture
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
        Celebrating the mountains, traditions, and spirit that connect us.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CULTURE_ITEMS.map((item) => {
          const found = firstExistingPublicFile(candidatePaths(item.slug));

          return (
            <figure
              key={item.slug}
              className="overflow-hidden rounded-lg border bg-card"
            >
              {found ? (
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={`/${found}`}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-1 border-b border-dashed bg-muted/40 p-4 text-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    Photo coming soon
                  </span>
                  <code className="text-[11px] text-muted-foreground/70">
                    public/images/culture/{item.slug}.jpg
                  </code>
                </div>
              )}
              <figcaption className="p-4">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.caption}</p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
