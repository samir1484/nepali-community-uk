"use client";

import { useState, useEffect, useCallback, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  createGame,
  applyMove,
  legalMoves,
  chooseTigerMove,
  neighbours,
  trappedTigerCount,
  goatsOnBoard,
  scoreFor,
  phase,
  BOARD_SIZE,
  TOTAL_GOATS,
  GOATS_TO_LOSE,
  TIGER_START,
  type GameState,
} from "@/lib/games/baghchal";
import { submitBaghChalScore, type SubmitScoreState } from "@/lib/actions/games";

const VIEW = 100;
const PAD = 10;
const STEP = (VIEW - PAD * 2) / (BOARD_SIZE - 1);
const xOf = (i: number) => PAD + (i % BOARD_SIZE) * STEP;
const yOf = (i: number) => PAD + Math.floor(i / BOARD_SIZE) * STEP;

/** Every line on the board, de-duplicated, for drawing the grid. */
const EDGES: Array<[number, number]> = (() => {
  const seen = new Set<string>();
  const out: Array<[number, number]> = [];
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    for (const n of neighbours(i)) {
      const key = i < n ? `${i}-${n}` : `${n}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([i, n]);
    }
  }
  return out;
})();

export function BaghChalBoard({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<GameState>(createGame);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Place a goat to begin.");
  const [result, setResult] = useState<SubmitScoreState | null>(null);
  const [isPending, startTransition] = useTransition();

  const myMoves = useMemo(
    () => (state.turn === "GOAT" && !state.winner ? legalMoves(state) : []),
    [state]
  );

  const placing = phase(state) === "PLACEMENT";

  const targetsFor = useCallback(
    (from: number) =>
      myMoves.filter((m) => m.kind === "MOVE" && m.from === from).map((m) => m.to),
    [myMoves]
  );

  // During placement every empty point is legal, so ringing them all is just
  // noise — the empty dots already show where a goat can go. Highlights are
  // only shown once they mean something: the chosen goat's destinations.
  const highlighted = useMemo<number[]>(() => {
    if (state.winner || state.turn !== "GOAT" || placing) return [];
    return selected === null ? [] : targetsFor(selected);
  }, [state.winner, state.turn, placing, selected, targetsFor]);

  const movableGoats = useMemo<number[]>(() => {
    if (placing || state.winner || state.turn !== "GOAT") return [];
    return [...new Set(myMoves.flatMap((m) => (m.kind === "MOVE" ? [m.from] : [])))];
  }, [placing, state.winner, state.turn, myMoves]);

  // Tigers reply on their own turn, after a short pause so the move is readable.
  useEffect(() => {
    if (state.winner || state.turn !== "TIGER") return;
    const timer = setTimeout(() => {
      const move = chooseTigerMove(state);
      if (!move) return;
      setState((current) => {
        if (current.turn !== "TIGER" || current.winner) return current;
        const next = applyMove(current, move);
        setStatus(
          move.kind === "JUMP"
            ? "A tiger ate one of your goats!"
            : "A tiger moved. Your turn."
        );
        return next;
      });
    }, 550);
    return () => clearTimeout(timer);
  }, [state]);

  // Report the finished game once.
  useEffect(() => {
    if (!state.winner || result) return;
    const outcome = {
      won: state.winner === "GOAT",
      drawn: state.winner === "DRAW",
      tigersTrapped: trappedTigerCount(state),
      goatsRemaining: goatsOnBoard(state),
      goatsCaptured: state.goatsCaptured,
    };
    startTransition(async () => {
      const res = await submitBaghChalScore(outcome);
      setResult(res);
      if (res.saved) router.refresh();
    });
  }, [state, result, router]);

  function handlePoint(index: number) {
    if (state.winner || state.turn !== "GOAT") return;

    if (placing) {
      const move = myMoves.find((m) => m.kind === "PLACE" && m.to === index);
      if (move) {
        setState(applyMove(state, move));
        setStatus("Goat placed. Tigers are thinking…");
      }
      return;
    }

    if (selected !== null) {
      const move = myMoves.find(
        (m) => m.kind === "MOVE" && m.from === selected && m.to === index
      );
      if (move) {
        setState(applyMove(state, move));
        setSelected(null);
        setStatus("Goat moved. Tigers are thinking…");
        return;
      }
    }

    if (state.board[index] === "GOAT" && movableGoats.includes(index)) {
      setSelected(index === selected ? null : index);
      setStatus("Now tap where you'd like it to go.");
      return;
    }

    setSelected(null);
  }

  function reset() {
    setState(createGame());
    setSelected(null);
    setResult(null);
    setStatus("Place a goat to begin.");
  }

  const liveScore = scoreFor({
    won: state.winner === "GOAT",
    tigersTrapped: trappedTigerCount(state),
    goatsRemaining: goatsOnBoard(state),
    goatsCaptured: state.goatsCaptured,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Goats left to place" value={state.goatsToPlace} />
        <Stat label="Goats eaten" value={`${state.goatsCaptured} / ${GOATS_TO_LOSE}`} />
        <Stat label="Tigers trapped" value={`${trappedTigerCount(state)} / ${TIGER_START.length}`} />
      </div>

      <div className="rounded-lg border bg-card p-3">
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="w-full touch-manipulation" role="img" aria-label="Bagh-Chal board">
          {EDGES.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={xOf(a)}
              y1={yOf(a)}
              x2={xOf(b)}
              y2={yOf(b)}
              stroke="currentColor"
              strokeWidth={0.4}
              className="text-muted-foreground/50"
            />
          ))}

          {state.board.map((cell, i) => {
            const isTarget = highlighted.includes(i);
            const isSelected = selected === i;
            const canPick = movableGoats.includes(i);
            return (
              <g key={i} onClick={() => handlePoint(i)} className="cursor-pointer">
                {/* Generous invisible tap area for phones. */}
                <circle cx={xOf(i)} cy={yOf(i)} r={8} fill="transparent" />
                {isTarget && (
                  <circle cx={xOf(i)} cy={yOf(i)} r={5.4} className="fill-primary/20 stroke-primary" strokeWidth={0.5} />
                )}
                {cell === "EMPTY" ? (
                  <circle cx={xOf(i)} cy={yOf(i)} r={1.6} className="fill-muted-foreground/60" />
                ) : cell === "TIGER" ? (
                  <g>
                    <circle cx={xOf(i)} cy={yOf(i)} r={4.6} className="fill-brand-crimson" />
                    <text
                      x={xOf(i)}
                      y={yOf(i) + 1.9}
                      textAnchor="middle"
                      fontSize={5}
                      className="pointer-events-none select-none fill-white"
                    >
                      🐯
                    </text>
                  </g>
                ) : (
                  <g>
                    <circle
                      cx={xOf(i)}
                      cy={yOf(i)}
                      r={4.2}
                      className={
                        isSelected
                          ? "fill-primary stroke-foreground"
                          : canPick
                            ? "fill-secondary stroke-primary"
                            : "fill-secondary stroke-transparent"
                      }
                      strokeWidth={0.6}
                    />
                    <text
                      x={xOf(i)}
                      y={yOf(i) + 1.8}
                      textAnchor="middle"
                      fontSize={4.6}
                      className="pointer-events-none select-none"
                    >
                      🐐
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-lg border bg-card p-4">
        {state.winner ? (
          <div>
            <p className="font-semibold text-foreground">
              {state.winner === "GOAT"
                ? "🎉 You win! Every tiger is trapped."
                : state.winner === "TIGER"
                  ? `The tigers ate ${GOATS_TO_LOSE} goats — they win this time.`
                  : "Draw — neither side could make progress."}
            </p>
            <p className="mt-1 text-muted-foreground">
              You scored <strong className="text-foreground">{result?.score ?? liveScore}</strong> points.
            </p>

            {isPending && <p className="mt-2 text-sm text-muted-foreground">Saving…</p>}

            {result?.saved && (
              <p className="mt-2 text-sm text-primary">Added to the leaderboard.</p>
            )}

            {result?.needsAccount && (
              <div className="mt-3 rounded-md bg-primary/10 p-3">
                <p className="text-sm text-foreground">{result.message}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" nativeButton={false} render={<Link href="/register">Register free</Link>} />
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={<Link href="/login?callbackUrl=/games/bagh-chal">Log in</Link>}
                  />
                </div>
              </div>
            )}

            {result && !result.saved && !result.needsAccount && (
              <p className="mt-2 text-sm text-destructive">{result.message}</p>
            )}

            <Button className="mt-4" onClick={reset}>
              Play again
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">{status}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {placing
                  ? `You're the goats — tap an empty point to place one. ${state.goatsToPlace} of ${TOTAL_GOATS} left.`
                  : "Tap one of your goats, then tap where to move it."}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              Restart
            </Button>
          </div>
        )}
      </div>

      {!isLoggedIn && !state.winner && (
        <p className="text-sm text-muted-foreground">
          Anyone can play. To appear on the leaderboard,{" "}
          <Link href="/register" className="text-primary underline underline-offset-4">
            register a free account
          </Link>
          .
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card px-2 py-3">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[11px] leading-tight text-muted-foreground">{label}</p>
    </div>
  );
}
