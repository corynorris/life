import React from "react";

import "./Cell.css";

function getClass(state) {
  switch (state) {
    case 0:
      return "dead";
    case 1:
      return "alive";
    case 2:
      return "born";
    default:
      return null;
  }
}

const Cell = ({ onCellClick, state }) => (
  <td onClick={onCellClick} className={getClass(state)} />
);



export default Cell;
