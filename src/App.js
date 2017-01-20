import React, { Component } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-intro">
          The Game of Life
        </h1>
        <Grid />
        <Controls />
      </div>
    );
  }
}


export default App;
