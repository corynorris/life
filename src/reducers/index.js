import {combineReducers } from 'redux'
import cells from './cells'
import interval from './interval'
import generations from './generations'

const gameOfLifeApp = combineReducers({
  cells,
  interval,
  generations
})

export default gameOfLifeApp;