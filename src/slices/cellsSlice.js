import { createSlice } from "@reduxjs/toolkit";
import { makeGrid as coreMakeGrid, makeRandomGrid as coreMakeRandomGrid, updateGrid, states } from "../core/core.js";
import constants from "../constants";

const initialState = coreMakeRandomGrid(
  constants.GRID_WIDTH,
  constants.GRID_HEIGHT,
  0
);

const cellsSlice = createSlice({
  name: "cells",
  initialState,
  reducers: {
    makeGrid: () => coreMakeGrid(constants.GRID_WIDTH, constants.GRID_HEIGHT, 0),
    makeRandomGrid: () =>
      coreMakeRandomGrid(constants.GRID_WIDTH, constants.GRID_HEIGHT, 0),
    spawnCell(state, action) {
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
