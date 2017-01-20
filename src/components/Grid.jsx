import React, { Component } from 'react';
import { connect } from 'react-redux'
import { spawnCell } from '../actions'
import Cell from './Cell';
import './Grid.css'

class Grid extends Component {
  render() {
    const rows = this.props.cells.map((row, y) => {
      return <tr key={y}>
        {row.map((state, x) => {
          return (
            <Cell
              key={x}
              state={this.props.cells[y][x]}
              onCellClick={this.props.onCellClick.bind(this, x, y)}
              />
          );
        })}
      </tr>
    });

    return (
      <table className="center">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

Grid.propTypes = {
  data: React.PropTypes.array
};


const mapStateToProps = ({cells}) => {
  return {
    cells
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCellClick: (x,y) => {
      dispatch(spawnCell(x,y))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);