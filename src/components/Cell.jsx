import React from 'react';
import './Cell.css';

const Cell = ({handleClick, state}) => (
    <td
      onClick={handleClick}
      className={state ? 'alive' : 'dead'} 
    />
);

Cell.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  state: React.PropTypes.number.isRequired
};

export default Cell;