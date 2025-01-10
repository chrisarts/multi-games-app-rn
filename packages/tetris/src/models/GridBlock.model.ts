import { type GridBlockEnum, GridBlockShapes } from '../utils/constants.utils';
import { MoveDirection, getMoveDirectionUnit } from './Action.model';
import { GridPosition } from './GridPosition.model';

export class GridBlock {
  readonly color: string;
  private state: {
    shape: number[][];
    position: GridPosition;
    collided: boolean;
    nextShape: number[][];
  };

  get currentPosition() {
    return this.state.position;
  }

  get currentShape() {
    return this.state.shape;
  }

  constructor(
    readonly blockName: GridBlockEnum['name'],
    initialPosition: GridPosition,
  ) {
    const { color, value } = GridBlockShapes[blockName];
    this.color = color;
    this.state = {
      shape: value,
      position: GridPosition.create(initialPosition),
      collided: false,
      nextShape: getRotatedShape(value),
    };
  }

  updatePosition(position: GridPosition, collided: boolean) {
    this.setState({
      ...this.state,
      position,
      collided,
    });
  }

  toPoints(withPos?: GridPosition) {
    const position = withPos ?? this.state.position;
    return shapeToPoints(this.state.shape, position);
  }

  toNextShape() {
    this.setState({
      nextShape: getRotatedShape(this.state.nextShape),
      shape: this.state.shape,
    });
  }

  getState() {
    return this.state;
  }

  private setState(nextState: Partial<GridBlock['state']>) {
    this.state = {
      ...this.state,
      ...nextState,
    };
  }
}

const getRotatedShape = (originalShape: number[][]) => {
  // Make the rows to become cols (transpose)
  const shape = originalShape.map((_, i) => originalShape.map((column) => column[i]));
  // Reverse each row to get a rotated matrix
  return shape.map((row) => row.toReversed());
};

const shapeToPoints = (
  shape: number[][],
  plusPosition = getMoveDirectionUnit(MoveDirection('zero')),
) => {
  return shape
    .map((rows, x) =>
      rows.map((column, y) => {
        if (column === 0) return null;
        return GridPosition.create({ x, y }).sum(plusPosition);
      }),
    )
    .flatMap((x) => x.filter((y) => y !== null));
};
