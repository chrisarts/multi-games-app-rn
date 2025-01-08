import * as Data from 'effect/Data';
import type { BoardPosition } from './Board.model';

export type __MoveDirectionEnum = Data.TaggedEnum<{
  LEFT: BoardPosition;
  RIGHT: BoardPosition;
  DOWN: BoardPosition;
  UP: BoardPosition;
  ROTATE: BoardPosition;
  ZERO: BoardPosition;
}>;

const { DOWN, LEFT, RIGHT, ROTATE, UP, ZERO } = Data.taggedEnum<__MoveDirectionEnum>();

export const playerMoves = {
  zero: (): BoardPosition => ZERO({ column: 0, row: 0 }),
  up: (x: number): BoardPosition => UP({ column: 0, row: x }),
  down: (x: number): BoardPosition => DOWN({ column: 0, row: x }),
  left: (x: number): BoardPosition => LEFT({ column: x, row: 0 }),
  right: (x: number): BoardPosition => RIGHT({ column: x, row: 0 }),
};
