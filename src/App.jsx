import React, { Component } from 'react';
import './App.css';
import Controls from './components/Controls';
import Generation from './components/Generation';
import Grid from './components/Grid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-intro">
          The Game of Life
        </h1>
        <Grid />
        <Controls />
        <Generation />
      </div>
    );
  }
}


export default App;
