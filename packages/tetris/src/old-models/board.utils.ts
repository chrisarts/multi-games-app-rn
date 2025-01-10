import type { GridPosition } from '../models/GridPosition.model';
import {
  type BoardConfig,
  type BoardMatrix,
  type BoardState,
  CellState,
} from './Board.model';

export const BOARD_CONFIG: BoardConfig = {
  HEIGHT: 15,
  WIDTH: 10,
};

export const createTetrisBoard = ({ WIDTH, HEIGHT }: BoardConfig): BoardMatrix => {
  return Array(HEIGHT)
    .fill(null)
    .map(() => Array(WIDTH).fill([null, CellState.EMPTY]));
};

export const hasCollisions = (
  board: BoardMatrix,
  player: BoardState,
  move: GridPosition,
) => {
  const shape = player.currentShape.shape;
  for (let row = 0; row < shape.length; row += 1) {
    for (let column = 0; column < shape[row].length; column += 1) {
      // 1. Check that we're on an actual Tetromino cell
      if (shape[row][column] !== 0) {
        const rowIndex = row + player.position.x + move.x;
        const colIndex = column + player.position.y + move.y;
        const rowCells = board[rowIndex];
        // 2. Check that our move is inside the game areas height (y)
        // That we're not moving through the bottom of the grid
        if (!rowCells) {
          return true;
        }
        const cell = rowCells[colIndex];
        // 3. Check that our move is inside the game areas width (x)
        if (!cell) {
          return true;
        }
        // 4. Check that the cell we're moving to isn't set to clear
        if (cell[1] !== CellState.EMPTY) {
          return true;
        }
      }
    }
  }
  return false;
};

export const structuredClone = <A>(a: A[]): A[] => {
  return JSON.parse(JSON.stringify(a));
};
