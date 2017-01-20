import {combineReducers } from 'redux'
import cells from './cells'

const gameOfLifeApp = combineReducers({
  cells
})

export default gameOfLifeApp;