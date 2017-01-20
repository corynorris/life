
const cells  = (state = 0, action) => {
  switch (action.type) {
    case 'PLAY':
      return action.intervalId
    default:
      return state;
  }
}

export default cells