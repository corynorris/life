import { makeGrid, type Grid } from "./core";

// ── Simulation type ──────────────────────────────────────────────────────────

export const SimulationType = {
  Life: "life",
  Seeds: "seeds",
  HighLife: "highlife",
  DayAndNight: "dayandnight",
  Maze: "maze",
  BriansBrain: "briansbrain",
  Rule30: "rule30",
  Rule90: "rule90",
  Rule110: "rule110",
  LangtonsAnt: "langtonsant",
} as const;

export type SimulationType =
  (typeof SimulationType)[keyof typeof SimulationType];

// ── Simulation metadata ─────────────────────────────────────────────────────

export interface SimulationInfo {
  label: string;
  description: string;
  rules: string;
  wikiUrl: string;
  category: "2D" | "1D" | "other";
}

export const SIMULATION_INFO: Record<SimulationType, SimulationInfo> = {
  [SimulationType.Life]: {
    label: "Conway's Life",
    description:
      "The classic zero-player game. Cells live or die based on their eight neighbors. " +
      "Famous patterns include gliders, blinkers, and the Gosper glider gun.",
    rules: "B3/S23 — born with 3 neighbors, survives with 2 or 3",
    wikiUrl: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
    category: "2D",
  },
  [SimulationType.Seeds]: {
    label: "Seeds",
    description:
      "An explosive rule where every live cell dies each generation. " +
      "Dead cells with exactly 2 neighbors are born. No still-lifes or oscillators can exist.",
    rules: "B2/S — born with 2 neighbors, nothing survives",
    wikiUrl: "https://en.wikipedia.org/wiki/Seeds_(cellular_automaton)",
    category: "2D",
  },
  [SimulationType.HighLife]: {
    label: "HighLife",
    description:
      "Like Conway's Life but cells are also born with 6 neighbors. " +
      "Features a unique replicator pattern that copies itself every 12 generations.",
    rules: "B36/S23 — born with 3 or 6 neighbors, survives with 2 or 3",
    wikiUrl: "https://en.wikipedia.org/wiki/HighLife",
    category: "2D",
  },
  [SimulationType.DayAndNight]: {
    label: "Day & Night",
    description:
      "A symmetric rule — if you invert the grid (swap alive ↔ dead), the behavior is identical. " +
      "Named because 'day' and 'night' patterns evolve the same way.",
    rules: "B3678/S34678 — symmetric birth and survival sets",
    wikiUrl:
      "https://en.wikipedia.org/wiki/Day_and_Night_(cellular_automaton)",
    category: "2D",
  },
  [SimulationType.Maze]: {
    label: "Maze",
    description:
      "Generates maze-like corridors. Cells survive with 1–5 neighbors, making dense connected structures " +
      "that resemble labyrinth passages.",
    rules: "B3/S12345 — born with 3 neighbors, survives with 1–5",
    wikiUrl: "https://en.wikipedia.org/wiki/Maze_(cellular_automaton)",
    category: "2D",
  },
  [SimulationType.BriansBrain]: {
    label: "Brian's Brain",
    description:
      "A 3-state automaton. Cells fire (on), then enter a refractory period (dying), then rest (off). " +
      "Produces gliders and chaotic behavior. Off → On with exactly 2 On neighbors.",
    rules: "3 states — Off → On (2 On neighbors), On → Dying, Dying → Off",
    wikiUrl: "https://en.wikipedia.org/wiki/Brian%27s_Brain",
    category: "2D",
  },
  [SimulationType.Rule30]: {
    label: "Rule 30",
    description:
      "A 1D cellular automaton that produces chaotic, seemingly random output from simple rules. " +
      "Used as a random number generator in Mathematica. The pattern looks like a pyramid with chaotic right edge.",
    rules: "Rule 30 (00011110 in binary) — neighborhood of 3 cells",
    wikiUrl: "https://en.wikipedia.org/wiki/Rule_30",
    category: "1D",
  },
  [SimulationType.Rule90]: {
    label: "Rule 90",
    description:
      "Generates the Sierpinski triangle — a beautiful fractal pattern. " +
      "Each cell is the XOR of its two neighbors above.",
    rules: "Rule 90 (01011010 in binary) — XOR of left and right neighbors",
    wikiUrl: "https://en.wikipedia.org/wiki/Rule_90",
    category: "1D",
  },
  [SimulationType.Rule110]: {
    label: "Rule 110",
    description:
      "Proven to be Turing-complete — capable of universal computation. " +
      "Exhibits complex behavior with interacting gliders and localized structures.",
    rules: "Rule 110 (01101110 in binary) — Turing-complete 1D automaton",
    wikiUrl: "https://en.wikipedia.org/wiki/Rule_110",
    category: "1D",
  },
  [SimulationType.LangtonsAnt]: {
    label: "Langton's Ant",
    description:
      "A single 'ant' walks a grid following two simple rules. " +
      "After ~10,000 steps of chaotic movement, it begins building a repeating 'highway' pattern. " +
      "Click to toggle cells under the ant.",
    rules:
      "On dead cell: turn right, set alive. On alive cell: turn left, set dead. Move forward.",
    wikiUrl: "https://en.wikipedia.org/wiki/Langton%27s_ant",
    category: "other",
  },
};

// ── Ant state ────────────────────────────────────────────────────────────────

export interface AntState {
  x: number;
  y: number;
  dir: number; // 0=N, 1=E, 2=S, 3=W
}

const DX = [0, 1, 0, -1] as const;
const DY = [-1, 0, 1, 0] as const;

export function createAnt(x: number, y: number, dir = 0): AntState {
  return { x, y, dir };
}

// ── Life-like rules ──────────────────────────────────────────────────────────

interface LifeLikeRule {
  born: Set<number>;
  survive: Set<number>;
}

const LIFE: LifeLikeRule = { born: new Set([3]), survive: new Set([2, 3]) };
const SEEDS: LifeLikeRule = { born: new Set([2]), survive: new Set() };
const HIGHLIFE: LifeLikeRule = {
  born: new Set([3, 6]),
  survive: new Set([2, 3]),
};
const DAY_AND_NIGHT: LifeLikeRule = {
  born: new Set([3, 6, 7, 8]),
  survive: new Set([3, 4, 6, 7, 8]),
};
const MAZE: LifeLikeRule = {
  born: new Set([3]),
  survive: new Set([1, 2, 3, 4, 5]),
};

const LIFE_LIKE_RULES: Record<string, LifeLikeRule> = {
  [SimulationType.Life]: LIFE,
  [SimulationType.Seeds]: SEEDS,
  [SimulationType.HighLife]: HIGHLIFE,
  [SimulationType.DayAndNight]: DAY_AND_NIGHT,
  [SimulationType.Maze]: MAZE,
};

function countNeighbours2D(
  grid: Grid,
  x: number,
  y: number,
  isAlive: (state: number) => boolean,
): number {
  const startX = Math.max(x - 1, 0);
  const startY = Math.max(y - 1, 0);
  const endX = Math.min(x + 1, grid[0].length - 1);
  const endY = Math.min(y + 1, grid.length - 1);
  let count = 0;
  for (let iy = startY; iy <= endY; iy++) {
    for (let ix = startX; ix <= endX; ix++) {
      if ((ix !== x || iy !== y) && isAlive(grid[iy][ix])) {
        count += 1;
      }
    }
  }
  return count;
}

/** Update a grid using a Life-like rule set (B/S). */
export function updateLifeLike(
  grid: Grid,
  rule: LifeLikeRule,
  isAlive: (state: number) => boolean,
  bornState: number,
  aliveState: number,
): { grid: Grid } {
  const height = grid.length;
  const width = grid[0].length;

  // First pass: count neighbors for every cell
  const neighbourCounts: number[][] = makeGrid(width, height, 0) as number[][];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      neighbourCounts[y][x] = countNeighbours2D(grid, x, y, isAlive);
    }
  }

  // Second pass: apply rules
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const n = neighbourCounts[y][x];
      if (isAlive(grid[y][x])) {
        grid[y][x] = rule.survive.has(n) ? aliveState : 0;
      } else {
        grid[y][x] = rule.born.has(n) ? bornState : 0;
      }
    }
  }

  return { grid };
}

// ── Conway's Life (the original, with "born" visual state) ───────────────────

/**
 * Classic Conway's Life with 3 states: 0=dead, 1=alive, 2=born.
 * born transitions to alive, giving a one-tick highlight.
 */
export function updateConway(grid: Grid): { grid: Grid } {
  const height = grid.length;
  const width = grid[0].length;

  const neighbourCounts: number[][] = makeGrid(width, height, 0) as number[][];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      neighbourCounts[y][x] = countNeighbours2D(
        grid,
        x,
        y,
        (s) => s !== 0,
      );
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // born → alive transition
      if (grid[y][x] === 2) {
        grid[y][x] = 1;
      }

      const n = neighbourCounts[y][x];
      if (n === 0 || n === 1 || n > 3) {
        grid[y][x] = 0;
      } else if (n === 3 && grid[y][x] !== 1) {
        grid[y][x] = 2;
      }
    }
  }

  return { grid };
}

// ── Brian's Brain ────────────────────────────────────────────────────────────

/**
 * 3-state CA: 0=off, 1=on (firing), 2=dying (refractory).
 * - Off → On if exactly 2 On neighbours
 * - On → Dying
 * - Dying → Off
 */
export function updateBriansBrain(grid: Grid): { grid: Grid } {
  const height = grid.length;
  const width = grid[0].length;

  const onCounts: number[][] = makeGrid(width, height, 0) as number[][];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      onCounts[y][x] = countNeighbours2D(grid, x, y, (s) => s === 1);
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      const on = onCounts[y][x];
      if (cell === 0 && on === 2) {
        grid[y][x] = 1; // off → on
      } else if (cell === 1) {
        grid[y][x] = 2; // on → dying
      } else if (cell === 2) {
        grid[y][x] = 0; // dying → off
      }
    }
  }

  return { grid };
}

// ── 1D Elementary Cellular Automata ─────────────────────────────────────────

const RULE_BITS: Record<string, number> = {
  [SimulationType.Rule30]: 30,
  [SimulationType.Rule90]: 90,
  [SimulationType.Rule110]: 110,
};

/**
 * Compute one row of a 1D elementary CA from the row above.
 * Wraps at edges (toroidal).
 */
function compute1DRow(above: number[], rule: number, width: number): number[] {
  const next: number[] = new Array(width);
  for (let x = 0; x < width; x++) {
    const left = above[(x - 1 + width) % width];
    const center = above[x];
    const right = above[(x + 1) % width];
    const pattern = (left !== 0 ? 4 : 0) | (center !== 0 ? 2 : 0) | (right !== 0 ? 1 : 0);
    next[x] = (rule >> pattern) & 1;
  }
  return next;
}

/**
 * 1D CA update. Uses caRow to track the last-written row.
 * When caRow reaches the bottom, shifts everything up.
 */
export function update1D(
  grid: Grid,
  ruleKey: string,
  caRow: number,
): { grid: Grid; caRow: number } {
  const rule = RULE_BITS[ruleKey];
  const height = grid.length;
  const width = grid[0].length;

  if (caRow < height - 1) {
    // Still have room — write to the next row
    const nextRow = compute1DRow(grid[caRow], rule, width);
    grid[caRow + 1] = nextRow;
    return { grid, caRow: caRow + 1 };
  } else {
    // Scroll: shift all rows up, compute new bottom row
    for (let y = 0; y < height - 1; y++) {
      grid[y] = grid[y + 1];
    }
    const nextRow = compute1DRow(grid[height - 2], rule, width);
    grid[height - 1] = nextRow;
    return { grid, caRow };
  }
}

// ── Langton's Ant ────────────────────────────────────────────────────────────

/**
 * Moves the ant one step. Grid cells are 0 (dead) or 1 (alive).
 * The ant wraps around edges.
 */
export function updateLangtonsAnt(
  grid: Grid,
  ant: AntState,
): { grid: Grid; ant: AntState } {
  const width = grid[0].length;
  const height = grid.length;

  const cell = grid[ant.y][ant.x];

  let newDir: number;
  if (cell === 0) {
    // Dead cell → turn right, set alive
    newDir = (ant.dir + 1) % 4;
    grid[ant.y][ant.x] = 1;
  } else {
    // Alive cell → turn left, set dead
    newDir = (ant.dir + 3) % 4;
    grid[ant.y][ant.x] = 0;
  }

  // Move forward (wrap around)
  const newX = (ant.x + DX[newDir] + width) % width;
  const newY = (ant.y + DY[newDir] + height) % height;

  return { grid, ant: { x: newX, y: newY, dir: newDir } };
}

// ── Initial state helpers ────────────────────────────────────────────────────

export function makeRandomGrid2D(
  width: number,
  height: number,
  fillState: number,
  density = 0.2,
): Grid {
  const grid = makeGrid(width, height, 0);
  for (let i = 0; i < width * height * density; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    grid[y][x] = fillState;
  }
  return grid;
}

/** Single alive cell in the middle of the top row. */
export function make1DSeedRow(width: number): Grid {
  const grid = makeGrid(width, 1, 0);
  grid[0][Math.floor(width / 2)] = 1;
  return grid;
}
