import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { spawnCell } from "../slices/cellsSlice";

import Cell from "./Cell";
import "./Grid.css";

const Grid = () => {
  const cells = useSelector((state) => state.cells);
  const dispatch = useDispatch();

  const handleCellClick = (x, y) => {
    dispatch(spawnCell({ x, y }));
  };

  const rows = cells.map((row, y) => {
    return (
      <tr key={y}>
        {row.map((state, x) => {
          return (
            <Cell
              key={x}
              state={cells[y][x]}
              onCellClick={() => handleCellClick(x, y)}
            />
          );
        })}
      </tr>
    );
  });

  return (
    <table className="center">
      <tbody>{rows}</tbody>
    </table>
  );
};

export default Grid;
