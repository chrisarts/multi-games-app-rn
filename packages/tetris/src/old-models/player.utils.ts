import { GridPosition } from '../models/GridPosition.model';

export const __playerMoves = {
  zero: (): GridPosition => GridPosition.create({ y: 0, x: 0 }),
  up: (x: number): GridPosition => GridPosition.create({ y: 0, x: x }),
  down: (x: number): GridPosition => GridPosition.create({ y: 0, x: x }),
  left: (y: number): GridPosition => GridPosition.create({ x: 0, y }),
  right: (y: number): GridPosition => GridPosition.create({ x: 0, y }),
  rotate: (): GridPosition => GridPosition.create({ x: 0, y: 0 }),
};
