import { FC } from "react";

import "./Cell.css";

function getClass(state: number): string {
  switch (state) {
    case 0:
      return "dead";
    case 1:
      return "alive";
    case 2:
      return "born";
    default:
      return "";
  }
}

interface CellProps {
  onCellClick: () => void;
  state: number;
}

const Cell: FC<CellProps> = ({ onCellClick, state }) => (
  <td onClick={onCellClick} className={getClass(state)} />
);

export default Cell;
