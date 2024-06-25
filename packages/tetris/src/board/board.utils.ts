import { BlockShapes } from "../models/Block.model";
import {
  CellState,
  BoardConfig,
  BoardState,
  BoardMatrix,
} from "../models/Board.model";
import { BoardPosition } from "../models/Point.model";
import { PlayerState } from "./usePlayer";

export const createTetrisBoard = ({
  WIDTH,
  HEIGHT,
}: BoardConfig): BoardMatrix => {
  return Array(HEIGHT)
    .fill(null)
    .map(() => Array(WIDTH).fill([null, CellState.EMPTY]));
};

export const getStartPoint = (WIDTH: number): BoardPosition => {
  return { column: WIDTH / 2 - 2, row: 0 };
};

export const hasCollisions = (
  board: BoardMatrix,
  player: PlayerState,
  move: BoardPosition
) => {
  const shape = BlockShapes[player.currentShape].shape;
  for (let row = 0; row < shape.length; row += 1) {
    for (let column = 0; column < shape[row].length; column += 1) {
      // 1. Check that we're on an actual Tetromino cell
      if (shape[row][column] !== 0) {
        const rowIndex = row + player.position.row + move.row;
        const colIndex = column + player.position.column + move.column;
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

export const addShapeToBoard = ({
  droppingShape,
  board,
  dropPosition,
  droppingBlock,
}: BoardState) => {
  // droppingShape.shape
  //   .filter((row) => row.some((x) => x === 1))
  //   .forEach((row, rowIndex) => {
  //     row.forEach((value, colIndex) => {
  //       if (value === 1) {
  //         board[dropPosition.row + rowIndex][dropPosition.column + colIndex] =
  //           droppingBlock;
  //       }
  //     });
  //   });
};

export const structuredClone = <A>(a: A[]): A[] => {
  return JSON.parse(JSON.stringify(a));
};
