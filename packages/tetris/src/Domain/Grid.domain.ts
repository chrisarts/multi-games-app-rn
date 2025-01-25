import {
  type Size,
  type SkPoint,
  type SkRect,
  Skia,
  point,
  rect,
  rrect,
} from '@shopify/react-native-skia';
import type { EdgeInsets } from 'react-native-safe-area-context';

export interface GridOptions {
  showEmptyCells: boolean;
}

export interface TetrisCell {
  point: SkPoint;
  value: number;
  color: string;
}
export interface TetrisGrid {
  name: string;
  position: SkPoint;
  color: string;
  cellsMatrix: GridMatrix;
  matrix: number[][];
}

export type GridMatrix = TetrisCell[][];

export interface GridSize {
  rows: number;
  columns: number;
}

interface CellConfig {
  spacing: number;
  size: number;
}
export interface GridConfig extends GridSize {
  width: number;
  height: number;
  midX: number;
  screen: Size;
  insets: EdgeInsets;
  gridPosition: SkPoint;
  defaultColor: string;
  cell: CellConfig;
  options: GridOptions;
}

export const matrixToPoints = (matrix: number[][], color: string): GridMatrix => {
  'worklet';
  return matrix.map((_, iy) =>
    _.map((value, ix) => ({
      point: point(ix, iy),
      value,
      color,
    })),
  );
};

export const getCellUIRect = (position: SkPoint, cellSize: number): SkRect => {
  'worklet';
  const x = position.x * cellSize;
  const y = position.y * cellSize;
  const width = cellSize - 1;
  const height = cellSize - 1;
  return rect(x, y, width, height);
};

export const getGridConfig = (
  screen: Size,
  insets: EdgeInsets,
  config: GridSize,
  options: GridOptions,
): GridConfig => {
  'worklet';
  const spacing = 3;
  const cellContainerSize = Math.floor(
    (screen.width - (spacing * config.columns) / 2) / config.columns,
  );
  const cellSize = cellContainerSize - spacing / 3;
  const canvasWidth = cellContainerSize * config.columns;
  const canvasHeight = cellContainerSize * config.rows;
  const midX = Math.floor(config.columns / 3);
  return {
    screen,
    insets,
    gridPosition: {
      x: (spacing * config.columns) / 2 / 2,
      y: screen.height - canvasHeight - insets.bottom,
    },
    cell: {
      size: cellContainerSize,
      spacing: spacing,
    },
    width: canvasWidth,
    height: canvasHeight,
    defaultColor: 'rgba(131, 126, 126, 0.3)',
    midX,
    options,
    ...config,
  };
};

export const getGridLayout = (
  { columns, rows }: GridSize,
  config: GridConfig,
): TetrisGrid => {
  'worklet';

  const matrix: number[][] = Array(rows)
    .fill(0)
    .map(() => Array(columns).fill(0));

  return {
    matrix,
    color: config.defaultColor,
    position: { y: 0, x: Math.floor(columns / 3) },
    cellsMatrix: matrixToPoints(matrix, config.defaultColor),
    name: 'Grid',
  };
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

export const createGridUIPath = (cells: SkRect[]) => {
  'worklet';
  const path = Skia.Path.Make();
  for (const rect of cells) {
    const cell = getCellUIRect(rect, rect.width);
    path.addRRect(rrect(cell, 5, 5));
  }
  return path;
};

export const getGridCellAt = (point: SkPoint, grid: TetrisGrid) => {
  'worklet';
  const row = grid.cellsMatrix[point.y];
  if (!row) return undefined;
  const cell = row[point.x];

  return cell;
};

export const drawGridMatrix = (gridMatrix: GridMatrix, gridConfig: GridConfig) => {
  'worklet';
  const surface = Skia.Surface.Make(gridConfig.width, gridConfig.height);
  const canvas = surface?.getCanvas();
  for (const cell of gridMatrix.flat()) {
    if (!gridConfig.options.showEmptyCells && cell.value === 0) continue;

    const skPath = Skia.Path.Make();
    skPath.addRRect(rrect(getCellUIRect(cell.point, gridConfig.cell.size), 5, 5));
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(cell.color));
    canvas?.drawPath(skPath, paint);
  }
  surface?.flush();
  return surface?.makeImageSnapshot() ?? null;
};
