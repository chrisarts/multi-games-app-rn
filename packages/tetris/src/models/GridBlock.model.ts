import d3Path from 'd3-path';
import * as Data from 'effect/Data';
import type { GridPoint } from './GridCell.model';

type GridBlockEnum = Data.TaggedEnum<{
  O: { name: 'O'; color: string; value: number[][] };
  I: { name: 'I'; color: string; value: number[][] };
  J: { name: 'J'; color: string; value: number[][] };
  L: { name: 'L'; color: string; value: number[][] };
  S: { name: 'S'; color: string; value: number[][] };
  T: { name: 'T'; color: string; value: number[][] };
  Z: { name: 'Z'; color: string; value: number[][] };
}>;
const GridBlockEnum = Data.taggedEnum<GridBlockEnum>();

export class GridBlock {
  readonly color: string;
  shape: number[][];
  position: Pick<GridPoint, 'x' | 'y'>;

  constructor(
    readonly blockName: GridBlockEnum['name'],
    initialPosition: [x: number, y: number],
  ) {
    const { color, value } = GridBlockShapes[blockName];
    this.color = color;
    this.shape = value;
    this.position = {
      x: initialPosition[0],
      y: initialPosition[1],
    };
  }

  rotate() {
    // Make the rows to become cols (transpose)
    const shape = this.shape.map((_, i) => this.shape.map((column) => column[i]));
    // Reverse each row to get a rotated matrix
    this.shape = shape.map((row) => row.reverse());
  }

  moveDown(steps = 1) {
    this.position = {
      y: 0,
      x: this.position.x + steps,
    };
  }

  toSvgPath(size: number) {
    const square = d3Path.path();
    square.rect(this.position.x, this.position.y, size, size);
    return square.toString();
  }
}

export const GridBlockShapes = {
  // 🟥
  O: GridBlockEnum.O({
    name: 'O',
    value: [
      [1, 1],
      [1, 1],
    ],
    color: 'rgba(223, 217, 36,1)',
  }),
  I: GridBlockEnum.I({
    name: 'I',
    value: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: 'rgba(80, 227, 230, 1)',
  }),
  J: GridBlockEnum.J({
    name: 'J',
    value: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: 'rgba(36, 95, 223,1)',
  }),
  L: GridBlockEnum.L({
    name: 'L',
    value: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: 'rgba(223, 173, 36,1)',
  }),
  S: GridBlockEnum.S({
    name: 'S',
    value: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'rgba(48, 211, 56,1)',
  }),
  T: GridBlockEnum.T({
    name: 'T',
    value: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    color: 'rgba(132, 61, 198,1)',
  }),
  Z: GridBlockEnum.Z({
    name: 'Z',
    value: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'rgba(227, 78, 78,1)',
  }),
};
