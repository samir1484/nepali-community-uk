"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  scoreFor,
  TIGER_START,
  TOTAL_GOATS,
  GOATS_TO_LOSE,
  MAX_POSSIBLE_SCORE,
  GAME_BAGH_CHAL,
} from "@/lib/games/baghchal";

/**
 * The client reports the *outcome*, never a score. The server recomputes the
 * score from these fields with the same function the UI displays, so posting
 * `score: 999999` isn't possible. A determined player could still craft a
 * plausible-looking outcome — fully preventing that needs server-authoritative
 * play (every move validated server-side), which isn't worth it for a community
 * game, but this stops trivial tampering.
 */
const resultSchema = z.object({
  won: z.coerce.boolean(),
  drawn: z.coerce.boolean(),
  tigersTrapped: z.coerce.number().int().min(0).max(TIGER_START.length),
  goatsRemaining: z.coerce.number().int().min(0).max(TOTAL_GOATS),
  goatsCaptured: z.coerce.number().int().min(0).max(GOATS_TO_LOSE),
});

export type SubmitScoreState = {
  saved: boolean;
  needsAccount?: boolean;
  score?: number;
  message: string;
};

export async function submitBaghChalScore(input: {
  won: boolean;
  drawn: boolean;
  tigersTrapped: number;
  goatsRemaining: number;
  goatsCaptured: number;
}): Promise<SubmitScoreState> {
  const parsed = resultSchema.safeParse(input);
  if (!parsed.success) {
    return { saved: false, message: "That game result didn't look valid." };
  }

  const { won, drawn, tigersTrapped, goatsRemaining, goatsCaptured } = parsed.data;

  // Cross-checks: a win means every tiger was trapped and fewer than the losing
  // number of goats were eaten. Rejecting the impossible combinations closes the
  // obvious way to fake a high score.
  if (won && (tigersTrapped !== TIGER_START.length || goatsCaptured >= GOATS_TO_LOSE)) {
    return { saved: false, message: "That game result didn't look valid." };
  }
  if (won && drawn) {
    return { saved: false, message: "That game result didn't look valid." };
  }
  if (goatsRemaining + goatsCaptured > TOTAL_GOATS) {
    return { saved: false, message: "That game result didn't look valid." };
  }

  const score = scoreFor({ won, tigersTrapped, goatsRemaining, goatsCaptured });
  if (score > MAX_POSSIBLE_SCORE) {
    return { saved: false, message: "That game result didn't look valid." };
  }

  const session = await auth();
  if (!session?.user?.id) {
    // Guests still get told what they scored — they just can't rank yet.
    return {
      saved: false,
      needsAccount: true,
      score,
      message: "Register or log in to add your score to the leaderboard.",
    };
  }

  await db.gameScore.create({
    data: {
      game: GAME_BAGH_CHAL,
      userId: session.user.id,
      score,
      won,
      drawn,
      tigersTrapped,
      goatsRemaining,
      goatsCaptured,
    },
  });

  revalidatePath("/games/bagh-chal");
  return { saved: true, score, message: `Score saved: ${score} points.` };
}

export type LeaderboardRow = {
  rank: number;
  name: string;
  image: string | null;
  score: number;
  won: boolean;
  playedAt: Date;
};

/**
 * One row per player — their personal best — so a single keen player can't fill
 * the whole table.
 */
export async function getBaghChalLeaderboard(limit = 20): Promise<LeaderboardRow[]> {
  const scores = await db.gameScore.findMany({
    where: { game: GAME_BAGH_CHAL },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    select: {
      score: true,
      won: true,
      createdAt: true,
      userId: true,
      user: { select: { name: true, image: true } },
    },
    take: 500,
  });

  const bestByUser = new Map<string, (typeof scores)[number]>();
  for (const row of scores) {
    if (!bestByUser.has(row.userId)) bestByUser.set(row.userId, row);
  }

  return [...bestByUser.values()]
    .sort((a, b) => b.score - a.score || a.createdAt.getTime() - b.createdAt.getTime())
    .slice(0, limit)
    .map((row, index) => ({
      rank: index + 1,
      name: row.user.name,
      image: row.user.image,
      score: row.score,
      won: row.won,
      playedAt: row.createdAt,
    }));
}
