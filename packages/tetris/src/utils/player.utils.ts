import type { BoardPosition } from '../models/Board.model';

export const playerMoves = {
  zero: (): BoardPosition => ({ y: 0, x: 0 }),
  up: (x: number): BoardPosition => ({ y: 0, x: x }),
  down: (x: number): BoardPosition => ({ y: 0, x: x }),
  left: (x: number): BoardPosition => ({ y: x, x: 0 }),
  right: (x: number): BoardPosition => ({ y: x, x: 0 }),
};

export const sumPositions = (a: BoardPosition, b: BoardPosition) => ({
  row: (a.x += b.x),
  column: (a.y += b.y),
});
