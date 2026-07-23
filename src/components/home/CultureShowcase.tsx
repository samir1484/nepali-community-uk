import type { HomeSection } from "@/generated/prisma/client";
import { AnimatedSection, ParallaxImage } from "@/components/animation/AnimatedSection";
import { np } from "@/lib/translations";

export function CultureShowcase({ sections }: { sections: HomeSection[] }) {
  if (sections.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">Nepali Heritage &amp; Culture</h2>
        <p className="font-nepali mt-1 text-muted-foreground">{np.heritageCulture}</p>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Celebrating the mountains, traditions, and spirit that connect us.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-2">
        {sections.map((section, index) => {
          const textOnRight = index % 2 === 1;
          const tint = index % 2 === 0 ? "crimson" : "blue";

          return (
            <AnimatedSection key={section.id} delay={0.05 * index}>
              <div className="relative min-h-[50vh] overflow-hidden sm:min-h-[65vh]">
                {section.imageUrl ? (
                  <>
                    <ParallaxImage src={section.imageUrl} alt={section.title} />
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
                        backgroundColor: tint === "crimson" ? "var(--brand-crimson)" : "var(--brand-blue)",
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
                      {section.title}
                    </h3>
                    {section.caption && (
                      <p className="mt-3 text-white/90 drop-shadow">{section.caption}</p>
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
