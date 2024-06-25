import { BoardPosition } from "../models";

export const playerMoves = {
  zero: (): BoardPosition => ({ column: 0, row: 0 }),
  up: (x: number): BoardPosition => ({ column: 0, row: x }),
  down: (x: number): BoardPosition => ({ column: 0, row: x }),
  left: (x: number): BoardPosition => ({ column: x, row: 0 }),
  right: (x: number): BoardPosition => ({ column: x, row: 0 }),
};
