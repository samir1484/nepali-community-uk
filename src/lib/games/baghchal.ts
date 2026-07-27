/**
 * Bagh-Chal (बाघचाल) — the traditional Nepali "Tigers and Goats" board game.
 *
 * Played on an Alquerque board: a 5x5 grid of points where every point connects
 * orthogonally, and diagonals exist only from points where (row + col) is even.
 * That's what produces the classic criss-cross pattern.
 *
 * Four tigers start in the corners. The goat player places 20 goats one at a
 * time, then moves them. Tigers capture by jumping a goat in a straight line
 * onto an empty point. Tigers win once they've eaten GOATS_TO_LOSE goats; goats
 * win by blocking every tiger so it has no legal move.
 *
 * Pure functions with no React or DB imports, so the same code runs in the
 * browser during play and on the server when validating a submitted score.
 */

/** Stored on GameScore rows so other games can share the table later. Lives here
 *  rather than in the actions file — a "use server" module may only export async
 *  functions, and exporting a constant from one breaks the whole module. */
export const GAME_BAGH_CHAL = "BAGH_CHAL";

export const BOARD_SIZE = 5;
export const POINTS = BOARD_SIZE * BOARD_SIZE;
export const TOTAL_GOATS = 20;
export const GOATS_TO_LOSE = 5;
export const TIGER_START = [0, 4, 20, 24];

/**
 * Once every goat is placed, both sides can shuffle pieces indefinitely without
 * either making progress — testing found ~5% of games never terminating. After
 * this many consecutive non-capturing moves the game is called a draw so a
 * player is never stuck in a game that can't finish.
 */
export const DRAW_MOVE_LIMIT = 60;

export type Cell = "EMPTY" | "TIGER" | "GOAT";
export type Side = "GOAT" | "TIGER";
export type Phase = "PLACEMENT" | "MOVEMENT";
export type Winner = "GOAT" | "TIGER" | "DRAW" | null;

export type GameState = {
  board: Cell[];
  turn: Side;
  goatsToPlace: number;
  goatsCaptured: number;
  /** Consecutive moves with no capture and no placement — drives the draw rule. */
  idleMoves: number;
  winner: Winner;
};

export type Move =
  | { kind: "PLACE"; to: number }
  | { kind: "MOVE"; from: number; to: number }
  | { kind: "JUMP"; from: number; to: number; over: number };

export function createGame(): GameState {
  const board: Cell[] = Array(POINTS).fill("EMPTY");
  for (const i of TIGER_START) board[i] = "TIGER";
  return {
    board,
    turn: "GOAT",
    goatsToPlace: TOTAL_GOATS,
    goatsCaptured: 0,
    idleMoves: 0,
    winner: null,
  };
}

const rowOf = (i: number) => Math.floor(i / BOARD_SIZE);
const colOf = (i: number) => i % BOARD_SIZE;
const inBounds = (r: number, c: number) =>
  r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;

/** Directions available from a point — diagonals only where (row+col) is even. */
function directions(index: number): Array<[number, number]> {
  const base: Array<[number, number]> = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  if ((rowOf(index) + colOf(index)) % 2 === 0) {
    base.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  }
  return base;
}

const adjacencyCache: number[][] = [];

export function neighbours(index: number): number[] {
  if (adjacencyCache[index]) return adjacencyCache[index];
  const r = rowOf(index);
  const c = colOf(index);
  const out: number[] = [];
  for (const [dr, dc] of directions(index)) {
    const nr = r + dr;
    const nc = c + dc;
    if (inBounds(nr, nc)) out.push(nr * BOARD_SIZE + nc);
  }
  adjacencyCache[index] = out;
  return out;
}

/**
 * Where a tiger at `from` lands if it jumps its neighbour `over`: two steps in
 * the same direction. Both hops must be real lines on the board, which is why
 * this checks adjacency rather than only arithmetic.
 */
function jumpTarget(from: number, over: number): number | null {
  const dr = rowOf(over) - rowOf(from);
  const dc = colOf(over) - colOf(from);
  const lr = rowOf(over) + dr;
  const lc = colOf(over) + dc;
  if (!inBounds(lr, lc)) return null;
  const landing = lr * BOARD_SIZE + lc;
  return neighbours(over).includes(landing) ? landing : null;
}

export function tigerMoves(state: GameState): Move[] {
  const moves: Move[] = [];
  state.board.forEach((cell, from) => {
    if (cell !== "TIGER") return;
    for (const over of neighbours(from)) {
      if (state.board[over] === "GOAT") {
        const landing = jumpTarget(from, over);
        if (landing !== null && state.board[landing] === "EMPTY") {
          moves.push({ kind: "JUMP", from, to: landing, over });
        }
      } else if (state.board[over] === "EMPTY") {
        moves.push({ kind: "MOVE", from, to: over });
      }
    }
  });
  return moves;
}

export function goatMoves(state: GameState): Move[] {
  if (state.goatsToPlace > 0) {
    return state.board
      .map((cell, i) => (cell === "EMPTY" ? ({ kind: "PLACE", to: i } as Move) : null))
      .filter((m): m is Move => m !== null);
  }

  const moves: Move[] = [];
  state.board.forEach((cell, from) => {
    if (cell !== "GOAT") return;
    for (const to of neighbours(from)) {
      if (state.board[to] === "EMPTY") moves.push({ kind: "MOVE", from, to });
    }
  });
  return moves;
}

export function legalMoves(state: GameState): Move[] {
  if (state.winner) return [];
  return state.turn === "TIGER" ? tigerMoves(state) : goatMoves(state);
}

export function phase(state: GameState): Phase {
  return state.goatsToPlace > 0 ? "PLACEMENT" : "MOVEMENT";
}

/** Tigers with no move at all — the goat player's whole objective. */
export function trappedTigerCount(state: GameState): number {
  let trapped = 0;
  state.board.forEach((cell, from) => {
    if (cell !== "TIGER") return;
    const canMove = neighbours(from).some((over) => {
      if (state.board[over] === "EMPTY") return true;
      if (state.board[over] !== "GOAT") return false;
      const landing = jumpTarget(from, over);
      return landing !== null && state.board[landing] === "EMPTY";
    });
    if (!canMove) trapped += 1;
  });
  return trapped;
}

export function goatsOnBoard(state: GameState): number {
  return state.board.filter((c) => c === "GOAT").length;
}

function withWinnerResolved(state: GameState): GameState {
  if (state.goatsCaptured >= GOATS_TO_LOSE) return { ...state, winner: "TIGER" };
  if (trappedTigerCount(state) === TIGER_START.length) return { ...state, winner: "GOAT" };
  if (state.idleMoves >= DRAW_MOVE_LIMIT) return { ...state, winner: "DRAW" };

  // A side with no legal move loses — in practice this is the tigers being
  // boxed in, which the check above already caught, but a goat player with
  // nowhere to go is stuck too and shouldn't leave the game unfinishable.
  if (legalMoves(state).length === 0) {
    return { ...state, winner: state.turn === "TIGER" ? "GOAT" : "TIGER" };
  }
  return state;
}

export function sameMove(a: Move, b: Move): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "PLACE" && b.kind === "PLACE") return a.to === b.to;
  if (a.kind === "MOVE" && b.kind === "MOVE") return a.from === b.from && a.to === b.to;
  if (a.kind === "JUMP" && b.kind === "JUMP") return a.from === b.from && a.to === b.to;
  return false;
}

export function applyMove(state: GameState, move: Move): GameState {
  if (state.winner) return state;
  if (!legalMoves(state).some((m) => sameMove(m, move))) return state;

  const board = [...state.board];
  let goatsToPlace = state.goatsToPlace;
  let goatsCaptured = state.goatsCaptured;
  // Placing a goat or taking one is progress; anything else edges toward a draw.
  let idleMoves = state.idleMoves + 1;

  if (move.kind === "PLACE") {
    board[move.to] = "GOAT";
    goatsToPlace -= 1;
    idleMoves = 0;
  } else {
    const piece = board[move.from];
    board[move.from] = "EMPTY";
    board[move.to] = piece;
    if (move.kind === "JUMP") {
      board[move.over] = "EMPTY";
      goatsCaptured += 1;
      idleMoves = 0;
    }
  }

  return withWinnerResolved({
    board,
    turn: state.turn === "GOAT" ? "TIGER" : "GOAT",
    goatsToPlace,
    goatsCaptured,
    idleMoves,
    winner: null,
  });
}

/**
 * Tiger AI. Captures are almost always correct, so it takes one when available,
 * breaking ties by how much freedom the jump leaves. Otherwise it maximises
 * total tiger mobility, which naturally avoids walking into a trap — the main
 * way a weak tiger AI loses instantly. Deliberately not perfect: it should be
 * beatable by a thoughtful goat player.
 */
export function chooseTigerMove(state: GameState): Move | null {
  const moves = tigerMoves(state);
  if (moves.length === 0) return null;

  const jumps = moves.filter((m) => m.kind === "JUMP");
  const candidates = jumps.length > 0 ? jumps : moves;

  let best: Move | null = null;
  let bestScore = -Infinity;

  for (const move of candidates) {
    const next = applyMove({ ...state, winner: null }, move);
    const mobility = tigerMoves({ ...next, turn: "TIGER" }).length;
    const trapped = trappedTigerCount(next);
    // Mobility keeps options open; being trapped is what loses the game.
    const score = mobility - trapped * 12 + Math.random();
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }

  return best ?? candidates[0];
}

/**
 * The single source of truth for scoring, used by the client to show a score
 * and by the server to recompute it — a client-supplied number is never
 * trusted on its own.
 */
export function scoreFor(input: {
  won: boolean;
  tigersTrapped: number;
  goatsRemaining: number;
  goatsCaptured: number;
}): number {
  const winBonus = input.won ? 500 : 0;
  const trapPoints = Math.max(0, Math.min(TIGER_START.length, input.tigersTrapped)) * 60;
  const survivorPoints = Math.max(0, Math.min(TOTAL_GOATS, input.goatsRemaining)) * 10;
  const lossPenalty = Math.max(0, Math.min(GOATS_TO_LOSE, input.goatsCaptured)) * 15;
  return Math.max(0, winBonus + trapPoints + survivorPoints - lossPenalty);
}

export const MAX_POSSIBLE_SCORE = scoreFor({
  won: true,
  tigersTrapped: TIGER_START.length,
  goatsRemaining: TOTAL_GOATS,
  goatsCaptured: 0,
});
