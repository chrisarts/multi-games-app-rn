import * as ReadOnlyArray from "effect/Array";
import { pipe } from "effect/Function";
import { BlockShape } from "../models/Block.model";
import { CellState, BoardCell, BoardConfig } from "../models/Board.model";
import { BoardPosition } from "../models/Point.model";

export const createTetrisBoard = ({ WIDTH, HEIGHT }: BoardConfig) => {
  const matrix: BoardCell[][] = pipe(
    ReadOnlyArray.makeBy(HEIGHT, (x) => x),
    ReadOnlyArray.map((_, y) => {
      return pipe(
        ReadOnlyArray.makeBy(WIDTH, (x) => x),
        ReadOnlyArray.map((_, x) => ({
          x,
          y,
          state: CellState.CLEAR,
          color: undefined,
        }))
      );
    })
  );
  return matrix;
};

export const getStartPoint = (WIDTH: number): BoardPosition => {
  return { y: 0, x: WIDTH / 2 - 2 };
};

export const updateBoardForShape = (
  board: BoardCell[][],
  position: BoardPosition,
  shape: BlockShape
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
  shape: BlockShape,
  board: BoardCell[][],
  position: BoardPosition,
  move: BoardPosition
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
