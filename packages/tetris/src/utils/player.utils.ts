import { GridPosition } from '../models/GridPosition.model';

export const playerMoves = {
  zero: (): GridPosition => GridPosition.create({ y: 0, x: 0 }),
  up: (x: number): GridPosition => GridPosition.create({ y: 0, x: x }),
  down: (x: number): GridPosition => GridPosition.create({ y: 0, x: x }),
  left: (y: number): GridPosition => GridPosition.create({ x: 0, y }),
  right: (y: number): GridPosition => GridPosition.create({ x: 0, y }),
  rotate: (): GridPosition => GridPosition.create({ x: 0, y: 0 }),
};

export const sumPositions = (a: GridPosition, b: GridPosition): GridPosition =>
  GridPosition.create({
    x: a.x + b.x,
    y: a.y + b.y,
  });
