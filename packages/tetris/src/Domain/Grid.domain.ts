import * as Sk from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { createRange } from '../utils/common.utils';

export interface TetrisAnimatedMatrix {
  point: Sk.SkPoint;
  value: SharedValue<number>;
  color: SharedValue<string>;
}

export interface TetrisGridCell {
  point: Sk.SkPoint;
  value: number;
  color: string;
}

export interface TetrisCell {
  point: Sk.SkPoint;
  value: number;
}
export interface TetrisGrid {
  name: string;
  position: Sk.Vector;
  color: string;
  cells: TetrisCell[];
  matrix: number[][];
}

export interface GridCoordinates {
  column: number;
  row: number;
}
export interface GridSize {
  rows: number;
  columns: number;
}
export interface GridConfig extends GridSize {
  width: number;
  height: number;
  midX: number;
  cellSpacing: number;
  cellSize: number;
  cellContainerSize: number;
}

export const matrixToPoints = (matrix: number[][]) => {
  'worklet';
  return matrix.flatMap((_, iy) =>
    _.map((value, ix) => ({
      point: Sk.vec(ix, iy),
      value,
    })),
  );
};

export const getCellUIRect = (position: Sk.Vector, cellSize: number): Sk.SkRect => {
  'worklet';
  const x = position.x * cellSize;
  const y = position.y * cellSize;
  const width = cellSize - 1;
  const height = cellSize - 1;
  return Sk.rect(x, y, width, height);
};

export const getGridConfig = (width: number, config: GridSize): GridConfig => {
  'worklet';
  const spacing = 3;
  const cellContainerSize = Math.floor(width / config.columns);
  const cellSize = cellContainerSize - spacing / 3;
  const canvasWidth = cellContainerSize * config.columns;
  const canvasHeight = cellContainerSize * (config.rows + spacing * 3);
  const midX = Math.floor(config.columns / 3);
  return {
    cellSize,
    cellContainerSize,
    width: canvasWidth,
    height: canvasHeight,
    midX,
    cellSpacing: spacing,
    ...config,
  };
};

export const getGridLayout = (
  { columns, rows }: GridSize,
  cellSize: GridConfig,
): TetrisGrid => {
  'worklet';

  const matrix: number[][] = Array(rows)
    .fill(0)
    .map(() => Array(columns).fill(0));

  return {
    cells: matrixToPoints(matrix),
    matrix,
    color: 'rgba(131, 126, 126, 0.3)',
    position: { y: 0, x: Math.floor(columns / 3) },
    name: 'Grid',
  };
};

export const isEmptyPoint = (grid: TetrisGrid, point: Sk.SkPoint) => {
  'worklet';
};

export const restartMatrix = (grid: TetrisGrid) => {
  'worklet';
  for (let r = 0; r < grid.matrix.length; r++) {
    grid.matrix[r] = [];
    for (let c = 0; c < grid.matrix[r].length; c++) {
      grid.matrix[r][c] = 0;
    }
  }
};

export const getBoardCoordinates = (
  coords: GridCoordinates,
  config: GridConfig,
): Sk.SkPoint => {
  'worklet';
  return {
    x: coords.column * config.cellContainerSize,
    y: coords.row * config.cellContainerSize,
  };
};

export const createGridUIPath = (cells: Sk.SkRect[]) => {
  'worklet';
  const path = Sk.Skia.Path.Make();
  for (const rect of cells) {
    const cell = getCellUIRect(rect, rect.width);
    path.addRRect(Sk.rrect(cell, 5, 5));
  }
  return path;
};

export const getMatrixCellAt = (point: Sk.SkPoint, matrix: TetrisAnimatedMatrix[][]) => {
  'worklet';
  const row = matrix[point.y];
  if (!row) return undefined;
  const cell = row[point.x];

  return cell;
};

export const mergeShapeAt = (
  point: Sk.SkPoint,
  shape: SharedValue<TetrisGrid>,
  matrix: TetrisAnimatedMatrix[][],
) => {
  'worklet';
  for (const shapeCell of shape.value.cells) {
    const gridPoint = Sk.add(point, shapeCell.point);
    const gridCell = getMatrixCellAt(gridPoint, matrix);
    if (shapeCell.value === 0) continue;

    if (!gridCell) {
      throw new Error('merging at invalid position');
    }
    gridCell.color.value = shape.value.color;
    gridCell.value.value = shapeCell.value;
  }

  return matrix;
};

export const shapeCollisionsAt = (
  at: Sk.SkPoint,
  shapeCells: TetrisGrid['cells'],
  matrix: TetrisAnimatedMatrix[][],
) => {
  'worklet';
  for (const shapeCell of shapeCells) {
    const gridPoint = Sk.add(at, shapeCell.point);
    const gridCell = getMatrixCellAt(gridPoint, matrix);
    if (shapeCell.value === 0) continue;

    if (!gridCell) {
      return {
        at: gridPoint,
        merge: gridPoint.y >= matrix.length,
        outsideGrid: true,
      };
    }
    if (gridCell.value.value > 0) {
      return {
        at: gridPoint,
        merge: true,
        outsideGrid: false,
      };
    }
  }

  return {
    outsideGrid: false,
    merge: false,
    at: Sk.point(0, 0),
  };
};

export const clearLines = (matrix: TetrisAnimatedMatrix[][], grid: TetrisGrid) => {
  'worklet';
  const linesToClear = matrix.filter((row) => row.every(({ value }) => value.value > 0));
  for (const cell of linesToClear.flat()) {
    const aboveCell = matrix[cell.point.y - 1][cell.point.x];
    cell.color.value = aboveCell.color.value;
    cell.value.value = aboveCell.value.value;
  }

  return {
    lines: linesToClear.length,
  };
};

const moveDownFrom = (
  gridMatrix: TetrisAnimatedMatrix[][],
  matrix: { rowIndex: number; cells: TetrisAnimatedMatrix[] }[],
  rowIndex: number,
) => {
  'worklet';
  for (const row of matrix.filter((x) => x.rowIndex <= rowIndex)) {
    for (const cell of row.cells) {
      const nextPos = { x: cell.point.x, y: cell.point.y + 1 };
      const nextCell = getMatrixCellAt(nextPos, gridMatrix);
      if (!nextCell) continue;

      cell.color.value = nextCell.color.value;
      cell.value.value = nextCell.value.value;
    }
  }
};

const sweepRowAndMoveDown = (row: TetrisAnimatedMatrix[], color: string) => {
  'worklet';
  for (const cell of row) {
    cell.color.value = color;
    cell.value.value = 0;
  }
};

export const sweepLines = (matrix: TetrisAnimatedMatrix[][], grid: TetrisGrid) => {
  'worklet';
  const clearLines = matrix.filter((row) => row.every((cell) => cell.value.value > 0));

  const rowCellsMatrix = createRange(matrix.length - 1)
    .reverse()
    .map((index) => ({
      rowIndex: index,
      cells: matrix.flat().filter((cell) => cell.point.y === index),
    }));

  for (const row of rowCellsMatrix) {
    if (row.cells.every((x) => x.value.value > 0)) {
      console.log('SWEEP: ', row.rowIndex);
      sweepRowAndMoveDown(row.cells, grid.color);
      moveDownFrom(matrix, rowCellsMatrix, row.rowIndex);
    }
  }

  return {
    count: clearLines.length,
  };
};
