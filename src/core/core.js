export const states = {
  dead: 0,
  alive: 1,
  born: 2,
}

const range = (size, val) => {
  return Array(size).fill(val);
}

export function isAlive(grid, x, y) {
  return grid[y][x] !== states.dead;
}

export function countNeighbours(grid, x, y) {
  const startX = Math.max(x - 1, 0);
  const startY = Math.max(y - 1, 0);
  const endX = Math.min(x + 1, grid[0].length - 1);
  const endY = Math.min(y + 1, grid.length - 1);
  let count = 0;
  for (let iy = startY; iy <= endY; iy++) {
    for (let ix = startX; ix <= endX; ix++) {
      if ((ix !== x || iy !== y) && isAlive(grid, ix, iy)) {
        count += 1;
      }
    }
  }
  return count;
}

export function makeGrid(width, height, val = 0) {
  return range(height, val).map((col) => {
    return range(width, val).map((row) => {
      return val;
    })
  })
}

export function makeRandomGrid(width, height, val = 0) {
  const grid = makeGrid(width, height, val);
  for (let i = 0; i < width * height * 0.2; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    grid[y][x] = states.alive;
  }
  return grid;
}


export function updateGrid(grid) {
  const width = grid[0].length;
  const height = grid.length;
  let neighboursGrid = makeGrid(width, height, 0);



  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      neighboursGrid[y][x] = countNeighbours(grid, x, y);
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Update born to alive
      if (grid[y][x] === states.born) {
        grid[y][x] = states.alive;
      }

      // Change behaviour based on neighbours      
      const neighbours = neighboursGrid[y][x];
      if (neighbours === 0 || neighbours === 1 || neighbours > 3) {
        grid[y][x] = states.dead;
      } else if (neighbours === 3 && grid[y][x] !== states.alive) {
        grid[y][x] = states.born;
      }

    }
  }
  return grid;
}