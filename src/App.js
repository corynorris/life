import React, { Component } from 'react';
import Grid from './components/Grid';
import './App.css';

import {makeGrid} from './core/core.js';

const testGrid = makeGrid(30,20,0);
class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-intro">
          The Game of Life
        </h1>
        <Grid data={testGrid} />
      </div>
    );
  }
}

export default App;
