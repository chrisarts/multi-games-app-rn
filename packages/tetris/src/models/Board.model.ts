import * as ReadOnlyArray from "effect/Array";
import { pipe } from "effect/Function";
import { TetrisShape } from "./Block.model";

export interface TetrisBoardCell {
  state: CellState;
  x: number;
  y: number;
}

export enum CellState {
  CLEAR,
  MERGED,
}

export const createTetrisBoard = (rows: number, columns: number) => {
  const matrix: TetrisBoardCell[][] = pipe(
    ReadOnlyArray.makeBy(rows, (x) => x),
    ReadOnlyArray.map((_, x) => {
      return pipe(
        ReadOnlyArray.makeBy(columns, (x) => x),
        ReadOnlyArray.map((_, y) => ({ x, y, state: CellState.CLEAR }))
      );
    })
  );
  const startPoint = { x: columns / 2 - 2, y: 0 };
  return { matrix, startPoint };
};

export const updateBoardForShape = (
  board: TetrisBoardCell[][],
  position: { x: number; y: number },
  shape: TetrisShape
) => {
  const boardPosition = board[position.x][position.y];
  board = board.map((rows) =>
    rows.map((cell) => ({ ...cell, state: CellState.CLEAR }))
  );
  shape.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        console.log("UPDATE: ", {
          y: y + boardPosition.y,
          x: x + boardPosition.x,
        });
        board[y + boardPosition.y][x + boardPosition.x] = {
          ...board[y + boardPosition.y][x + boardPosition.x],
          state: CellState.MERGED,
        };
      }
    });
  });
  return board;
};

export const checkCollision = (
  shape: TetrisShape,
  board: TetrisBoardCell[][],
  position: { x: number; y: number },
  move: { x: number; y: number }
) => {
  for (let y = 0; y < shape.shape.length; y += 1) {
    for (let x = 0; x < shape.shape[y].length; x += 1) {
      // Check that we are on shape cell
      let cell = shape.shape[y][x];
      if (cell !== 0) {
        // Check that our move is valid
        const nextY = y + position.y + move.y;
        const nextX = x + position.x + move.x;
        if (!board[nextY]) {
          console.log("Shape will move beyond (y) axis", { nextX, nextY });
          return true;
        }
        if (!board[nextY][nextX]) {
          console.log("Shape will move beyond (x) axis", board[nextY][nextX]);
          return true;
        }
        if (board[nextY][nextX].state !== CellState.CLEAR) {
          console.log("Next Cell is occupied ", board[nextY][nextX]);
          return true;
        }
      }
    }
  }
  return false;
};
