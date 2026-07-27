import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { BaghChalBoard } from "@/components/games/BaghChalBoard";
import { getBaghChalLeaderboard } from "@/lib/actions/games";
import { PageBackground } from "@/components/layout/PageBackground";
import { getSiteImage } from "@/lib/settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GOATS_TO_LOSE, TOTAL_GOATS } from "@/lib/games/baghchal";

export const metadata: Metadata = {
  title: "Bagh-Chal — Play the Nepali Tigers & Goats Game",
  description:
    "Play Bagh-Chal (बाघचाल), the traditional Nepali board game of Tigers and Goats, free in your browser. Trap all four tigers, beat the computer and climb the community leaderboard.",
  alternates: { canonical: "/games/bagh-chal" },
  openGraph: {
    title: "Bagh-Chal — Play the Nepali Tigers & Goats Game | Nepali Community UK",
    description:
      "Play Bagh-Chal, the traditional Nepali Tigers and Goats game, and climb the community leaderboard.",
    url: "/games/bagh-chal",
  },
};

export default async function BaghChalPage() {
  const session = await auth();
  const [leaderboard, backgroundImage] = await Promise.all([
    getBaghChalLeaderboard().catch(() => []),
    getSiteImage("page.news.image", "/images/culture/stupa-alt.webp"),
  ]);

  return (
    <PageBackground image={backgroundImage}>
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">
          Bagh-Chal <span className="font-nepali text-2xl text-muted-foreground">बाघचाल</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          The traditional Nepali game of Tigers and Goats. Play either side against the
          computer — as the goats, surround all four tigers so they can&apos;t move; as
          the tigers, hunt down {GOATS_TO_LOSE} goats before you get cornered.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <BaghChalBoard isLoggedIn={Boolean(session?.user)} />

            <div className="mt-8 rounded-lg border bg-card p-4">
              <h2 className="font-semibold text-foreground">How to play</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li>
                  The goat side places {TOTAL_GOATS} goats, one per turn, while the tigers
                  move between turns. Once every goat is down, both sides move one piece
                  per turn along any line.
                </li>
                <li>
                  A tiger eats a goat by jumping straight over it onto an empty point — so
                  a goat with a gap directly behind it is in danger.
                </li>
                <li>
                  <strong className="text-foreground">Playing the goats:</strong> win by
                  blocking all four tigers so none can move. You lose if {GOATS_TO_LOSE}{" "}
                  goats are eaten.
                </li>
                <li>
                  <strong className="text-foreground">Playing the tigers:</strong> win by
                  eating {GOATS_TO_LOSE} goats. You lose if the goats corner every tiger.
                </li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Scoring — goats: 500 for a win, 60 per trapped tiger, 10 per surviving
                goat, minus 15 per goat eaten. Tigers: 500 for a win, 80 per goat eaten,
                minus 40 per tiger cornered.
              </p>
            </div>
          </div>

          <aside>
            <div className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold text-foreground">Leaderboard</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Each player&apos;s best result.
              </p>

              {leaderboard.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  No scores yet — play a game and be the first on the board.
                </p>
              ) : (
                <ol className="mt-4 space-y-2">
                  {leaderboard.map((row) => (
                    <li key={`${row.rank}-${row.name}`} className="flex items-center gap-3">
                      <span className="w-5 shrink-0 text-sm font-semibold text-muted-foreground">
                        {row.rank}
                      </span>
                      <Avatar className="size-7 shrink-0">
                        {row.image && <AvatarImage src={row.image} alt="" />}
                        <AvatarFallback>{row.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        <span title={row.side === "TIGER" ? "Played as the tigers" : "Played as the goats"}>
                          {row.side === "TIGER" ? "🐯" : "🐐"}
                        </span>{" "}
                        {row.name}
                        {row.won && <span title="Won a game"> 🏆</span>}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-foreground">
                        {row.score}
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              {!session?.user && (
                <p className="mt-4 border-t pt-3 text-sm text-muted-foreground">
                  <Link href="/register" className="text-primary underline underline-offset-4">
                    Register free
                  </Link>{" "}
                  to save your scores here.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PageBackground>
  );
}
