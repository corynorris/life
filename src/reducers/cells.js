import {makeGrid, makeRandomGrid, updateGrid, states} from '../core/core.js';
import constants from '../constants';

const startingCells = makeRandomGrid(constants.GRID_WIDTH, 
                               constants.GRID_HEIGHT,
                               0);

const cells  = (state = startingCells, action) => {
  let nextState = state.slice(0);
  switch (action.type) {
    case 'MAKE_GRID':
      return makeGrid(constants.GRID_WIDTH, constants.GRID_HEIGHT, 0)
    case 'MAKE_RANDOM_GRID':
      return makeRandomGrid(constants.GRID_WIDTH, constants.GRID_HEIGHT, 0);
    case 'SPAWN_CELL':
      nextState[action.y][action.x] = states.born;
      return nextState;
    case 'STEP_FORWARD':
      return updateGrid(nextState);
    default:
      return state;
  }
}

export default cells