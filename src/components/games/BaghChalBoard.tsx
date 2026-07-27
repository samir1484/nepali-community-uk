"use client";

import { useState, useEffect, useCallback, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  createGame,
  applyMove,
  legalMoves,
  chooseMoveFor,
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
  type Side,
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

const opponentOf = (side: Side): Side => (side === "GOAT" ? "TIGER" : "GOAT");

export function BaghChalBoard({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [side, setSide] = useState<Side | null>(null);
  const [state, setState] = useState<GameState>(createGame);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<SubmitScoreState | null>(null);
  const [isPending, startTransition] = useTransition();

  const myTurn = side !== null && state.turn === side && !state.winner;

  const myMoves = useMemo(() => (myTurn ? legalMoves(state) : []), [myTurn, state]);
  const placing = phase(state) === "PLACEMENT";
  /** Only the goat side places; the tiger side always moves a piece. */
  const isPlacingTurn = placing && side === "GOAT";

  const targetsFor = useCallback(
    (from: number) =>
      myMoves
        .filter((m) => (m.kind === "MOVE" || m.kind === "JUMP") && m.from === from)
        .map((m) => (m as { to: number }).to),
    [myMoves]
  );

  const highlighted = useMemo<number[]>(() => {
    if (!myTurn || isPlacingTurn) return [];
    return selected === null ? [] : targetsFor(selected);
  }, [myTurn, isPlacingTurn, selected, targetsFor]);

  const movablePieces = useMemo<number[]>(() => {
    if (!myTurn || isPlacingTurn) return [];
    return [
      ...new Set(
        myMoves.flatMap((m) => (m.kind === "MOVE" || m.kind === "JUMP" ? [m.from] : []))
      ),
    ];
  }, [myTurn, isPlacingTurn, myMoves]);

  // The computer replies on its own turn, after a short pause so the move reads.
  useEffect(() => {
    if (side === null || state.winner || state.turn === side) return;
    const ai = opponentOf(side);
    const timer = setTimeout(() => {
      const move = chooseMoveFor(state, ai);
      if (!move) return;
      setState((current) => {
        if (current.winner || current.turn === side) return current;
        const next = applyMove(current, move);
        setStatus(
          move.kind === "JUMP"
            ? "A tiger ate a goat!"
            : ai === "TIGER"
              ? "A tiger moved. Your turn."
              : move.kind === "PLACE"
                ? "A goat was placed. Your turn."
                : "A goat moved. Your turn."
        );
        return next;
      });
    }, 550);
    return () => clearTimeout(timer);
  }, [state, side]);

  // Report the finished game once.
  useEffect(() => {
    if (!state.winner || result || side === null) return;
    const outcome = {
      side,
      won: state.winner === side,
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
  }, [state, result, side, router]);

  function start(chosen: Side) {
    setSide(chosen);
    setState(createGame());
    setSelected(null);
    setResult(null);
    setStatus(
      chosen === "GOAT"
        ? "Place a goat to begin."
        : "You're the tigers — the goats go first."
    );
  }

  function handlePoint(index: number) {
    if (!myTurn) return;

    if (isPlacingTurn) {
      const move = myMoves.find((m) => m.kind === "PLACE" && m.to === index);
      if (move) {
        setState(applyMove(state, move));
        setStatus("Goat placed. The tigers are thinking…");
      }
      return;
    }

    if (selected !== null) {
      const move = myMoves.find(
        (m) => (m.kind === "MOVE" || m.kind === "JUMP") && m.from === selected && m.to === index
      );
      if (move) {
        setState(applyMove(state, move));
        setSelected(null);
        setStatus(
          move.kind === "JUMP" ? "You ate a goat!" : "Moved. The computer is thinking…"
        );
        return;
      }
    }

    if (movablePieces.includes(index)) {
      setSelected(index === selected ? null : index);
      setStatus("Now tap where you'd like it to go.");
      return;
    }

    setSelected(null);
  }

  if (side === null) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h2 className="font-semibold text-foreground">Choose your side</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The computer plays the other one.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => start("GOAT")}
            className="rounded-lg border p-4 text-left transition-all hover:border-primary active:scale-[0.98]"
          >
            <span className="text-2xl" aria-hidden="true">
              🐐
            </span>
            <p className="mt-2 font-semibold text-foreground">Play as the Goats</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Place {TOTAL_GOATS} goats and surround every tiger. The classic challenge.
            </p>
          </button>
          <button
            type="button"
            onClick={() => start("TIGER")}
            className="rounded-lg border p-4 text-left transition-all hover:border-primary active:scale-[0.98]"
          >
            <span className="text-2xl" aria-hidden="true">
              🐯
            </span>
            <p className="mt-2 font-semibold text-foreground">Play as the Tigers</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hunt down {GOATS_TO_LOSE} goats by jumping them — before you get cornered.
            </p>
          </button>
        </div>
      </div>
    );
  }

  const liveScore = scoreFor(
    {
      won: state.winner === side,
      tigersTrapped: trappedTigerCount(state),
      goatsRemaining: goatsOnBoard(state),
      goatsCaptured: state.goatsCaptured,
    },
    side
  );

  const outcomeText =
    state.winner === "DRAW"
      ? "Draw — neither side could make progress."
      : state.winner === side
        ? side === "GOAT"
          ? "🎉 You win! Every tiger is trapped."
          : `🎉 You win! You ate ${GOATS_TO_LOSE} goats.`
        : side === "GOAT"
          ? `The tigers ate ${GOATS_TO_LOSE} goats — they win this time.`
          : "Your tigers are all trapped — the goats win this time.";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
        <p className="text-sm text-muted-foreground">
          Playing as{" "}
          <strong className="text-foreground">
            {side === "GOAT" ? "🐐 the Goats" : "🐯 the Tigers"}
          </strong>
        </p>
        <Button variant="ghost" size="sm" onClick={() => setSide(null)}>
          Switch side
        </Button>
      </div>

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
            const canPick = movablePieces.includes(i);
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
                    <circle
                      cx={xOf(i)}
                      cy={yOf(i)}
                      r={4.6}
                      className={
                        isSelected
                          ? "fill-brand-crimson stroke-foreground"
                          : canPick
                            ? "fill-brand-crimson stroke-primary"
                            : "fill-brand-crimson stroke-transparent"
                      }
                      strokeWidth={0.6}
                    />
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
            <p className="font-semibold text-foreground">{outcomeText}</p>
            <p className="mt-1 text-muted-foreground">
              You scored <strong className="text-foreground">{result?.score ?? liveScore}</strong> points.
            </p>

            {isPending && <p className="mt-2 text-sm text-muted-foreground">Saving…</p>}
            {result?.saved && <p className="mt-2 text-sm text-primary">Added to the leaderboard.</p>}

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

            <div className="mt-4 flex gap-2">
              <Button onClick={() => start(side)}>Play again</Button>
              <Button variant="outline" onClick={() => setSide(null)}>
                Change side
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">{status}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {isPlacingTurn
                  ? `Tap an empty point to place a goat. ${state.goatsToPlace} of ${TOTAL_GOATS} left.`
                  : myTurn
                    ? `Tap one of your ${side === "GOAT" ? "goats" : "tigers"}, then tap where to move it.`
                    : "The computer is thinking…"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => start(side)}>
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
