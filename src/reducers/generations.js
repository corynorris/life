const generations  = (state = 0, action) => {
  switch (action.type) {
    case 'MAKE_GRID':
    case 'MAKE_RANDOM_GRID':
      return 0;
    case 'STEP_FORWARD':
      return state + 1;
    default:
      return state;
  }
}

export default generations