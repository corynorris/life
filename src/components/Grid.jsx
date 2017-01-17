import React, {Component} from 'react';
import Cell from './Cell';
import './Grid.css'

class Grid extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(x, y) {
    console.log(x,y);
  }

  render() {
    console.log(this.props.data);
    const rows = this.props.data.map((row,y) => {
      return <tr key={y}> 
        {row.map((state, x) => {
          return (
            <Cell
              key={x}
              state={state}
              handleClick={this.handleClick.bind(this, x, y)}
            />
          );
        })}
      </tr>
    });
    console.log(rows);
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

export default Grid;