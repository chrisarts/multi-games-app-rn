import { GridPosition } from '../models/GridPosition.model';

export const __playerMoves = {
  zero: (): GridPosition => GridPosition.create({ column: 0, row: 0 }),
  up: (x: number): GridPosition => GridPosition.create({ column: 0, row: x }),
  down: (x: number): GridPosition => GridPosition.create({ column: 0, row: x }),
  left: (y: number): GridPosition => GridPosition.create({ row: 0, column: y }),
  right: (y: number): GridPosition => GridPosition.create({ row: 0, column: y }),
  rotate: (): GridPosition => GridPosition.create({ row: 0, column: 0 }),
};
