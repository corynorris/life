import { describe, it, expect } from "vitest";
import {
  makeGrid,
  countNeighbours,
  updateGrid,
  states,
  type Grid,
} from "./core";

describe("makeGrid", () => {
  it("fills correctly when numbers are used", () => {
    const grid = makeGrid(3, 3, states.dead);
    const goalGrid: Grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    expect(grid).toEqual(goalGrid);
  });
});

describe("countNeighbours", () => {
  it("counts no neighbours", () => {
    const grid: Grid = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ];
    expect(countNeighbours(grid, 0, 0)).toEqual(0);
    expect(countNeighbours(grid, 2, 0)).toEqual(0);
    expect(countNeighbours(grid, 2, 2)).toEqual(0);
  });

  it("counts varying numbers of neighbours", () => {
    const grid: Grid = [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];
    expect(countNeighbours(grid, 0, 0)).toEqual(3);
    expect(countNeighbours(grid, 2, 2)).toEqual(1);
    expect(countNeighbours(grid, 1, 2)).toEqual(2);
  });

  it("can make a grid of neighbours", () => {
    const grid: Grid = [
      [1, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const neighboursGrid: number[][] = [[], [], []];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        neighboursGrid[y][x] = countNeighbours(grid, x, y);
      }
    }
    expect(neighboursGrid).toEqual([
      [1, 1, 1],
      [2, 2, 1],
      [0, 0, 0],
    ]);
  });
});

describe("updateGrid", () => {
  it("lets cells die when they have 0 neighbours", () => {
    const grid: Grid = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ];
    const nextGrid = updateGrid(grid);
    expect(nextGrid).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("lets cells die when they only have 1 neighbour", () => {
    const grid: Grid = [
      [1, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const nextGrid = updateGrid(grid);
    expect(nextGrid).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("doesn't affect cells with 2 neighbours", () => {
    const grid: Grid = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    const nextGrid = updateGrid(grid);
    expect(nextGrid).toEqual([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
  });

  it("doesn't kill cells with 3 neighbours", () => {
    const grid: Grid = [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];
    const nextGrid = updateGrid(grid);
    expect(nextGrid).toEqual([
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]);
  });

  it("kills a cell if it has more than 3 neighbours, births a cell if it has exactly 3", () => {
    const grid: Grid = [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ];
    const nextGrid = updateGrid(grid);
    expect(nextGrid).toEqual([
      [0, states.born, 0],
      [states.born, 0, states.born],
      [0, states.born, 0],
    ]);
  });
});
