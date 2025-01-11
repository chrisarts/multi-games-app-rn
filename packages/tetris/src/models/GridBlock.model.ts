import { type GridBlockEnum, getGridBlockShape } from '../utils/constants.utils';
import { MoveDirection, getMoveDirectionUnit } from './Action.model';
import { GridPosition } from './GridPosition.model';

// const blockShapesCache = new Map<GridBlockEnum['name'], BlockShape[]>();

export class GridBlock {
  readonly _tag = 'GridBlock';
  readonly color: string;
  private shape: GridBlockEnum['value'];

  private get zeroPoints() {
    return shapeToPoints(this.shape);
  }

  get zeroBounds() {
    const { column, row } = getBlockBounds(this.zeroPoints);
    return {
      max: GridPosition.create({ row: row.max, column: column.max }),
      min: GridPosition.create({ row: row.min, column: column.min }),
    };
  }

  constructor(readonly blockName: GridBlockEnum['name']) {
    const matrix = getGridBlockShape(blockName);
    this.color = matrix.color;
    this.shape = matrix.value;
  }

  adjustInitialPosition(initial: GridPosition) {
    const bounds = this.getBoundsFor(initial);
    return bounds.min;
  }

  rotate() {
    this.shape = getRotatedShape(this.shape);
  }

  getGridPointsAt(atPosition: GridPosition) {
    return this.zeroPoints.map((x) => atPosition.sum(x));
  }

  getBoundsFor(position: GridPosition) {
    const zero = this.zeroBounds;
    return {
      max: position.sum(zero.max),
      min: position.sum(zero.min),
    };
  }
}

const getBlockBounds = (positions: GridPosition[]) =>
  positions.reduce(
    (prev, current) => {
      const { column, row } = prev;
      if (current.row > row.max) row.max = current.row;
      if (current.row < row.min) row.min = current.row;
      if (current.column > column.max) column.max = current.column;
      if (current.column < column.min) column.min = current.column;
      return prev;
    },
    {
      row: {
        min: 0,
        max: 0,
      },
      column: {
        min: 0,
        max: 0,
      },
    },
  );

const getRotatedShape = (originalShape: number[][]) => {
  // Make the rows to become cols (transpose)
  const shape = originalShape.map((_, i) => originalShape.map((column) => column[i]));
  // Reverse each row to get a rotated matrix
  return shape.map((row) => row.reverse());
};

const shapeToPoints = (
  shape: number[][],
  plusPosition = getMoveDirectionUnit(MoveDirection('zero')),
) => {
  return shape
    .map((rows, x) =>
      rows.map((column, y) => {
        if (column === 0) return null;
        return GridPosition.create({ row: x, column: y }).sum(plusPosition);
      }),
    )
    .flatMap((x) => x.filter((y) => y !== null));
};

// const getShapeUniqueSum = (matrix: number[][]) => {
//   const sums = matrix.reduce((prev, rows, x) => {
//     const colsSum = rows.reduce((prevCol, col, y) => {
//       if (col === 0) return prevCol;
//       return x - y + prev;
//     }, 0);
//     return prev + colsSum;
//   }, 0);
//   return Hash.number(sums);
// };

// const getOrSetBlockShape = (anyBlock: GridBlockEnum) => {
//   if (blockShapesCache.has(anyBlock.name)) {
//     return blockShapesCache.get(anyBlock.name)!;
//   }

//   const newShape = new BlockShape(anyBlock.value);
//   console.log('\n SHAME name: ', anyBlock.name);
//   const rotations = getAllShapeRotations(newShape);
//   blockShapesCache.set(anyBlock.name, rotations);
//   return rotations;
// };

// const getAllShapeRotations = (shape: BlockShape): BlockShape[] => {
//   const results: BlockShape[] = [shape];
//   let stop = false;
//   while (!stop) {
//     const rotatedMatrix = getRotatedShape(shape.matrix);
//     const nextShape = new BlockShape(rotatedMatrix);

//     stop = results.some((x) => x.key.id === nextShape.key.id);
//     if (stop) break;

//     results.push(nextShape);
//   }

//   return results;
// };
