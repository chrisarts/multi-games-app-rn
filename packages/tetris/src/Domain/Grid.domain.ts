import {
  type Size,
  type SkPoint,
  type SkRect,
  point,
  rect,
} from '@shopify/react-native-skia';
import type { EdgeInsets } from 'react-native-safe-area-context';

export interface TetrisCell {
  value: number;
  x: number;
  y: number;
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
  innerSize: number;
}
export interface GridConfig extends GridSize {
  size: Size;
  screen: Size;
  center: SkPoint;
  content: SkRect;
  insets: EdgeInsets;
  infoSquareRect: SkRect;
  midX: number;
  defaultColor: string;
  cell: CellConfig;
}

export const matrixToPoints = (matrix: number[][], cellSize: number): GridMatrix => {
  'worklet';
  return matrix.map((_, iy) =>
    _.map((value, ix) => ({
      point: point(ix, iy),
      x: ix,
      y: iy,
      value,
      width: cellSize,
      height: cellSize,
    })),
  );
};

export const getGridConfig = (
  screen: Size,
  insets: EdgeInsets,
  config: GridSize,
): GridConfig => {
  'worklet';
  const spacing = 3;
  const canvasMaxWidth = screen.width * 0.75;
  const cellOuterSize = Math.floor(canvasMaxWidth / config.columns);
  const cellInnerSize = cellOuterSize - spacing;

  const canvasWidth = cellOuterSize * config.columns;
  const canvasHeight = cellOuterSize * config.rows + cellOuterSize;
  const midX = Math.floor(config.columns / 2);
  const positionX = screen.width - canvasWidth - spacing * 2;
  const positionY = screen.height - canvasHeight - insets.bottom / 2;

  const infoSquareRect = rect(
    1,
    screen.height - canvasHeight + insets.bottom / 2,
    screen.width * 0.24,
    screen.height * 0.2,
  );

  return {
    screen,
    insets,
    center: point(screen.width / 2, screen.height / 2),
    content: rect(positionX, positionY, screen.width, canvasHeight),
    infoSquareRect,
    cell: {
      size: cellOuterSize,
      spacing: spacing,
      innerSize: cellInnerSize,
    },
    size: {
      width: canvasWidth,
      height: canvasHeight,
    },
    defaultColor: 'rgba(131, 126, 126, 0.3)',
    midX,
    ...config,
  };
};

export const gridSizeToMatrix = (size: GridSize, cellSize: number): GridMatrix => {
  'worklet';
  return matrixToPoints(
    Array(size.rows)
      .fill(0)
      .map(() => Array(size.columns).fill(0)),
    cellSize,
  );
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
    cellsMatrix: matrixToPoints(matrix, config.cell.size),
    name: 'Grid',
  };
};
