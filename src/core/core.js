const range = (size, val) => {
  return Array(size).fill(0);
}

export function countNeighbours(grid, x, y) {
  const startX = Math.max(x - 1, 0);
  const startY = Math.max(y - 1, 0);
  const endX = Math.min(x+1, grid[0].length-1);
  const endY = Math.min(y+1, grid.length-1);
  let count = 0;
  for (let iy = startY; iy <= endY; iy++) {
    for (let ix = startX; ix <= endX; ix++) {
      if ((ix !== x || iy !== y) && grid[iy][ix] === 1) {
        count += 1;
      }
    }
  }
  return count;
}

export function makeGrid(width, height, val) {
  return range(height, val).map((col) => {
    return range(width, val).map((row)=> {
      return val;
    })
  })
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
      const neighbours = neighboursGrid[y][x];
      if (neighbours === 0 || neighbours === 1 || neighbours > 3) {
        grid[y][x] = 0;  
      } else if (neighbours === 3) {
        grid[y][x] = 1;  
      } 

    }
  }
  return grid;
}