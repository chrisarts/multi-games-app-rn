import * as Sk from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';

export interface TetrisAnimatedMatrix {
  point: Sk.SkPoint;
  value: SharedValue<number>;
  color: SharedValue<string>;
}

export interface TetrisGrid {
  name: string;
  position: Sk.Vector;
  color: string;
  cells: {
    point: Sk.SkPoint;
    value: number;
  }[];
  matrix: number[][];
}

export interface GridCoordinates {
  column: number;
  row: number;
}
export interface GridConfigInput {
  rows: number;
  columns: number;
}
export interface GridConfig extends GridConfigInput {
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

export const getGridConfig = (width: number, config: GridConfigInput): GridConfig => {
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
  { columns, rows }: GridConfigInput,
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
