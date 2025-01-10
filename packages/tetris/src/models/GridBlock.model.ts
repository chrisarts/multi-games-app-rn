import { sumPositions } from '../utils';
import { type GridBlockEnum, GridBlockShapes } from '../utils/constants.utils';
import type { BoardPosition } from './Board.model';
import { GridPoint } from './GridCell.model';

export class GridBlock {
  readonly color: string;
  shape: number[][];
  position: GridPoint;

  constructor(
    readonly blockName: GridBlockEnum['name'],
    initialPosition: BoardPosition,
  ) {
    const { color, value } = GridBlockShapes[blockName];
    this.color = color;
    this.shape = value;
    this.position = GridPoint.create(initialPosition);
  }

  updatePosition(position: BoardPosition) {
    this.position = GridPoint.create(position);
  }

  rotate() {
    // Make the rows to become cols (transpose)
    const shape = this.shape.map((_, i) => this.shape.map((column) => column[i]));
    // Reverse each row to get a rotated matrix
    this.shape = shape.map((row) => row.reverse());
  }

  toPoints(withPos?: GridPoint) {
    const position = withPos ?? this.position;
    return this.shape
      .map((rows, x) =>
        rows.map((column, y) => {
          if (column === 0) return null;
          return GridPoint.create({ x: x + position.x, y: y + position.y });
        }),
      )
      .flatMap((x) => x.filter((y) => y !== null));
  }
}
