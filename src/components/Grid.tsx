import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spawnCell } from "../slices/cellsSlice";
import type { RootState, AppDispatch } from "../store";
import type { Grid as GridType } from "../core/core";

import Cell from "./Cell";
import "./Grid.css";

const Grid: FC = () => {
  const cells = useSelector((state: RootState) => state.cells) as GridType;
  const dispatch = useDispatch<AppDispatch>();

  const handleCellClick = (x: number, y: number) => {
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
