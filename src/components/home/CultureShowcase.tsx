import { firstExistingPublicFile } from "@/lib/media";
import { AnimatedSection, ParallaxImage } from "@/components/animation/AnimatedSection";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

const SHOWCASE_ITEMS = [
  {
    slug: "mountains",
    title: "The Himalayas",
    caption: "Home to eight of the world's ten highest peaks, including Sagarmatha.",
    tint: "crimson",
  },
  {
    slug: "khukuri",
    title: "The Gurkha Khukuri",
    caption: "A symbol of Gurkha courage and centuries of proud military tradition.",
    tint: "blue",
  },
  {
    slug: "stupa",
    title: "Sacred Stupas",
    caption: "Boudhanath and Swayambhunath stand among the world's holiest Buddhist sites.",
    tint: "crimson",
  },
  {
    slug: "festival",
    title: "Festivals & Tradition",
    caption: "From Dashain to Tihar, celebrations that bring the community together.",
    tint: "blue",
  },
  {
    slug: "temple",
    title: "Sacred Temples",
    caption: "Pashupatinath and countless other temples anchor Nepal's spiritual life.",
    tint: "crimson",
  },
  {
    slug: "tradition",
    title: "Living Culture",
    caption: "Traditions like the Kumari carry Nepal's heritage into every generation.",
    tint: "blue",
  },
] as const;

function candidatePaths(slug: string) {
  return EXTENSIONS.map((ext) => `images/culture/${slug}.${ext}`);
}

export function CultureShowcase() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">Nepali Heritage &amp; Culture</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Celebrating the mountains, traditions, and spirit that connect us.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-2">
        {SHOWCASE_ITEMS.map((item, index) => {
          const found = firstExistingPublicFile(candidatePaths(item.slug));
          const textOnRight = index % 2 === 1;

          return (
            <AnimatedSection key={item.slug} delay={0.05 * index}>
              <div className="relative min-h-[50vh] overflow-hidden sm:min-h-[65vh]">
                {found ? (
                  <>
                    <ParallaxImage src={`/${found}`} alt={item.title} />
                    <div
                      className="absolute inset-0 mix-blend-multiply"
                      style={{
                        backgroundImage: textOnRight
                          ? "linear-gradient(260deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.5) 40%, rgba(10,10,15,0.1) 100%)"
                          : "linear-gradient(100deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.5) 40%, rgba(10,10,15,0.1) 100%)",
                      }}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-0 opacity-25 mix-blend-color"
                      style={{
                        backgroundColor:
                          item.tint === "crimson" ? "var(--brand-crimson)" : "var(--brand-blue)",
                      }}
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-crimson/20 to-brand-blue/20" />
                )}

                <div
                  className={`relative flex h-full min-h-[50vh] items-end p-8 sm:min-h-[65vh] sm:items-center sm:p-16 ${
                    textOnRight ? "justify-end text-right" : "justify-start text-left"
                  }`}
                >
                  <div className="max-w-md">
                    <h3 className="text-3xl font-bold text-white drop-shadow-md sm:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-white/90 drop-shadow">{item.caption}</p>
                    {!found && (
                      <code className="mt-3 block text-xs text-white/70">
                        public/images/culture/{item.slug}.jpg
                      </code>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}
