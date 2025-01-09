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
  zero: (): BoardPosition => ZERO({ y: 0, x: 0 }),
  up: (x: number): BoardPosition => UP({ y: 0, x: x }),
  down: (x: number): BoardPosition => DOWN({ y: 0, x: x }),
  left: (x: number): BoardPosition => LEFT({ y: x, x: 0 }),
  right: (x: number): BoardPosition => RIGHT({ y: x, x: 0 }),
};
