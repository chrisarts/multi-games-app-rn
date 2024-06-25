import { CellState, BoardConfig, BoardState } from "../models/Board.model";
import { BoardPosition } from "../models/Point.model";

export const createTetrisBoard = ({ WIDTH, HEIGHT }: BoardConfig) => {
  return Array(HEIGHT)
    .fill(null)
    .map(() => Array(WIDTH).fill(CellState.EMPTY));
};

export const getStartPoint = (WIDTH: number): BoardPosition => {
  return { column: WIDTH / 2 - 2, row: 0 };
};

export const hasCollisions = ({
  droppingShape,
  board,
  dropPosition,
}: BoardState) => {
  let hasCollision = false;
  droppingShape.shape
    .filter((row) => row.some((x) => x === 1))
    .forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (
          col === 1 &&
          (dropPosition.row + rowIndex >= board.length ||
            dropPosition.column + colIndex >= board[0].length ||
            dropPosition.column + colIndex < 0 ||
            board[dropPosition.row + rowIndex][
              dropPosition.column + colIndex
            ] !== CellState.EMPTY)
        ) {
          hasCollision = true;
        }
      });
    });
  return hasCollision;
};

export const addShapeToBoard = ({
  droppingShape,
  board,
  dropPosition,
  droppingBlock,
}: BoardState) => {
  droppingShape.shape
    .filter((row) => row.some((x) => x === 1))
    .forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 1) {
          board[dropPosition.row + rowIndex][dropPosition.column + colIndex] =
            droppingBlock;
        }
      });
    });
};

export const structuredClone = <A>(a: A[]): A[] => {
  return JSON.parse(JSON.stringify(a));
};
