import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Grid } from "../core/core";
import {
	SimulationType,
	type AntState,
	createAnt,
	updateConway,
	updateLifeLike,
	updateBriansBrain,
	update1D,
	updateLangtonsAnt,
	makeRandomGrid2D,
	type SimulationType as SimType,
} from "../core/simulations";

// ── Grid size presets ────────────────────────────────────────────────────────

export interface GridSize {
	width: number;
	height: number;
	label: string;
}

export const GRID_SIZE_PRESETS: GridSize[] = [
	{ width: 20, height: 15, label: "Small" },
	{ width: 30, height: 20, label: "Medium" },
	{ width: 50, height: 35, label: "Large" },
	{ width: 80, height: 50, label: "Huge" },
];

const DEFAULT_SIZE = GRID_SIZE_PRESETS[1]; // Medium

/** Compute cell pixel size so the grid fits within ~500px */
export function computeCellSize(width: number, height: number): number {
	return Math.max(4, Math.min(15, Math.floor(500 / Math.max(width, height))));
}

// ── Life-like rule lookup ────────────────────────────────────────────────────

const LIFE_LIKE_IS_ALIVE = (s: number) => s !== 0;

const LIFE_LIKE_CONFIGS: Record<
	string,
	{ born: Set<number>; survive: Set<number> }
> = {
	[SimulationType.Seeds]: { born: new Set([2]), survive: new Set() },
	[SimulationType.HighLife]: {
		born: new Set([3, 6]),
		survive: new Set([2, 3]),
	},
	[SimulationType.DayAndNight]: {
		born: new Set([3, 6, 7, 8]),
		survive: new Set([3, 4, 6, 7, 8]),
	},
	[SimulationType.Maze]: {
		born: new Set([3]),
		survive: new Set([1, 2, 3, 4, 5]),
	},
};

// ── State ────────────────────────────────────────────────────────────────────

export interface CellsState {
	grid: Grid;
	simulation: SimType;
	ant: AntState;
	caRow: number;
	gridWidth: number;
	gridHeight: number;
}

function makeEmptyGrid(w: number, h: number): Grid {
	return Array.from({ length: h }, () => Array(w).fill(0));
}

function makeInitialGrid(sim: SimType, w: number, h: number): Grid {
	switch (sim) {
		case SimulationType.Rule30:
		case SimulationType.Rule90:
		case SimulationType.Rule110: {
			const grid = makeEmptyGrid(w, h);
			grid[0][Math.floor(w / 2)] = 1;
			return grid;
		}
		case SimulationType.LangtonsAnt:
			return makeEmptyGrid(w, h);
		case SimulationType.BriansBrain:
			return makeRandomGrid2D(w, h, 1, 0.15);
		default:
			return makeRandomGrid2D(w, h, 1, 0.2);
	}
}

const initialSim = SimulationType.Life;
const w0 = DEFAULT_SIZE.width;
const h0 = DEFAULT_SIZE.height;

const initialState: CellsState = {
	grid: makeInitialGrid(initialSim, w0, h0),
	simulation: initialSim,
	ant: createAnt(Math.floor(w0 / 2), Math.floor(h0 / 2)),
	caRow: 0,
	gridWidth: w0,
	gridHeight: h0,
};

// ── Slice ────────────────────────────────────────────────────────────────────

const cellsSlice = createSlice({
	name: "cells",
	initialState,
	reducers: {
		makeGrid(state) {
			const { gridWidth: w, gridHeight: h } = state;
			state.grid = makeEmptyGrid(w, h);
			state.ant = createAnt(Math.floor(w / 2), Math.floor(h / 2));
			state.caRow = 0;
		},

		makeRandomGrid(state) {
			const sim = state.simulation;
			const w = state.gridWidth;
			const h = state.gridHeight;
			state.ant = createAnt(Math.floor(w / 2), Math.floor(h / 2));
			state.caRow = 0;

			switch (sim) {
				case SimulationType.Rule30:
				case SimulationType.Rule90:
				case SimulationType.Rule110: {
					state.grid = makeEmptyGrid(w, h);
					state.grid[0][Math.floor(w / 2)] = 1;
					break;
				}
				case SimulationType.LangtonsAnt:
					state.grid = makeEmptyGrid(w, h);
					break;
				case SimulationType.BriansBrain:
					state.grid = makeRandomGrid2D(w, h, 1, 0.15);
					break;
				default:
					state.grid = makeRandomGrid2D(w, h, 1, 0.2);
					break;
			}
		},

		spawnCell(state, action: PayloadAction<{ x: number; y: number }>) {
			const { x, y } = action.payload;
			const sim = state.simulation;

			if (
				sim === SimulationType.Rule30 ||
				sim === SimulationType.Rule90 ||
				sim === SimulationType.Rule110
			) {
				const row = Math.min(state.caRow, state.gridHeight - 1);
				state.grid[row][x] = state.grid[row][x] === 0 ? 1 : 0;
			} else if (sim === SimulationType.BriansBrain) {
				state.grid[y][x] = (state.grid[y][x] + 1) % 3;
			} else {
				state.grid[y][x] = state.grid[y][x] === 0 ? 1 : 0;
			}
		},

		stepForward(state) {
			const sim = state.simulation;

			switch (sim) {
				case SimulationType.Life:
					updateConway(state.grid);
					break;

				case SimulationType.Seeds:
				case SimulationType.HighLife:
				case SimulationType.DayAndNight:
				case SimulationType.Maze: {
					const rule = LIFE_LIKE_CONFIGS[sim];
					updateLifeLike(state.grid, rule, LIFE_LIKE_IS_ALIVE, 1, 1);
					break;
				}

				case SimulationType.BriansBrain:
					updateBriansBrain(state.grid);
					break;

				case SimulationType.Rule30:
				case SimulationType.Rule90:
				case SimulationType.Rule110: {
					const result = update1D(state.grid, sim, state.caRow);
					state.grid = result.grid;
					state.caRow = result.caRow;
					break;
				}

				case SimulationType.LangtonsAnt: {
					const result = updateLangtonsAnt(state.grid, state.ant);
					state.grid = result.grid;
					state.ant = result.ant;
					break;
				}
			}
		},

		setSimulation(state, action: PayloadAction<SimType>) {
			const sim = action.payload;
			const w = state.gridWidth;
			const h = state.gridHeight;
			state.simulation = sim;
			state.grid = makeInitialGrid(sim, w, h);
			state.ant = createAnt(Math.floor(w / 2), Math.floor(h / 2));
			state.caRow = 0;
		},

		setGridSize(
			state,
			action: PayloadAction<{ width: number; height: number }>,
		) {
			const { width: w, height: h } = action.payload;
			state.gridWidth = w;
			state.gridHeight = h;
			state.grid = makeInitialGrid(state.simulation, w, h);
			state.ant = createAnt(Math.floor(w / 2), Math.floor(h / 2));
			state.caRow = 0;
		},
	},
});

export const {
	makeGrid,
	makeRandomGrid,
	spawnCell,
	stepForward,
	setSimulation,
	setGridSize,
} = cellsSlice.actions;
export default cellsSlice.reducer;
