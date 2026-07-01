import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  makeGrid as coreMakeGrid,
  makeRandomGrid as coreMakeRandomGrid,
  updateGrid,
  states,
  type Grid,
} from "../core/core";
import constants from "../constants";

const initialState: Grid = coreMakeRandomGrid(
  constants.GRID_WIDTH,
  constants.GRID_HEIGHT,
  states.dead,
);

const cellsSlice = createSlice({
  name: "cells",
  initialState,
  reducers: {
    makeGrid: () =>
      coreMakeGrid(constants.GRID_WIDTH, constants.GRID_HEIGHT, states.dead),
    makeRandomGrid: () =>
      coreMakeRandomGrid(
        constants.GRID_WIDTH,
        constants.GRID_HEIGHT,
        states.dead,
      ),
    spawnCell(state, action: PayloadAction<{ x: number; y: number }>) {
      const { x, y } = action.payload;
      state[y][x] = states.born;
    },
    stepForward(state) {
      return updateGrid(state);
    },
  },
});

export const { makeGrid, makeRandomGrid, spawnCell, stepForward } =
  cellsSlice.actions;
export default cellsSlice.reducer;
