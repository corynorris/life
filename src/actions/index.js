export const makeGrid = () => {
  return {
    type: 'MAKE_GRID',
  }
}

export const makeRandomGrid = () => {
  return {
    type: 'MAKE_RANDOM_GRID',
  }
}

export const spawnCell = (x, y) => {
  return {
    type: 'SPAWN_CELL',
    x,
    y
  }
}

export const stepForward = () => {
  return {
    type: 'STEP_FORWARD',
  }
}

export const play = (intervalId) => {
  return {
    type: 'PLAY',
    intervalId
  }
}

export const pause = () => {
  return {
    type: 'PAUSE',
  }
}