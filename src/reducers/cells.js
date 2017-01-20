import {makeGrid, updateGrid, states} from '../core/core.js';
import constants from '../constants';

const startingCells = makeGrid(constants.GRID_WIDTH, 
                               constants.GRID_HEIGHT,
                               0);

const cells  = (state = startingCells, action) => {
    switch (action.type) {
      case 'MAKE_GRID':
        return makeGrid(constants.GRID_WIDTH, constants.GRID_HEIGHT, 0)
      case 'MAKE_RANDOM_GRID':
        const grid = makeGrid(constants.GRID_WIDTH, constants.GRID_HEIGHT, 0);
        for (let i = 0; i < constants.GRID_WIDTH * constants.GRID_HEIGHT * 0.2; i++) {
          const x = Math.floor(Math.random()*constants.GRID_WIDTH);
          const y = Math.floor(Math.random()*constants.GRID_HEIGHT);
          grid[y][x] = states.alive;
        }
        return grid;
      case 'SPAWN_CELL':
        const nextState = state.slice(0);
        nextState[action.y][action.x] = states.born;
        return nextState;
      case 'STEP_FORWARD':
        return updateGrid(state.slice(0));
      case 'PLAY':
        return updateGrid(state.slice(0));
      default:
        return state;
    }
}

export default cells