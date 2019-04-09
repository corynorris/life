import React from "react";
import PropTypes from "prop-types";

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

Cell.propTypes = {
  onCellClick: PropTypes.func.isRequired,
  state: PropTypes.number.isRequired
};

export default Cell;
