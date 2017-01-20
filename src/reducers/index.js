import {combineReducers } from 'redux'
import cells from './cells'
import interval from './interval'

const gameOfLifeApp = combineReducers({
  cells,
  interval
})

export default gameOfLifeApp;