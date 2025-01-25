import {
  PaintStyle,
  type Size,
  type SkPoint,
  type SkRect,
  Skia,
  StrokeCap,
  StrokeJoin,
  point,
  rect,
  rrect,
} from '@shopify/react-native-skia';
import type { EdgeInsets } from 'react-native-safe-area-context';

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

export const matrixToPoints = (
  matrix: number[][],
  color = 'rgba(131, 126, 126, 0.3)',
): GridMatrix => {
  'worklet';
  return matrix.map((_, iy) =>
    _.map((value, ix) => ({
      point: point(ix, iy),
      value,
      color,
    })),
  );
};

export const getCellUIRect = (position: SkPoint, cellSize: number, spacing = -1): SkRect => {
  'worklet';
  const x = position.x * cellSize;
  const y = position.y * cellSize;
  const width = cellSize + spacing;
  const height = cellSize + spacing;
  return rect(x, y, width, height);
};

export const getGridConfig = (
  screen: Size,
  insets: EdgeInsets,
  config: GridSize,
): GridConfig => {
  'worklet';
  const spacing = 3;
  const canvasMaxWidth = screen.width * 0.8;
  const cellOuterSize = Math.floor(canvasMaxWidth / config.columns);
  const cellInnerSize = cellOuterSize - spacing;

  const canvasWidth = cellOuterSize * config.columns;
  const canvasHeight = cellOuterSize * config.rows + cellOuterSize;
  const midX = Math.floor(config.columns / 2);
  const positionX = (screen.width - canvasWidth - spacing * 2);
  const positionY = screen.height - canvasHeight - insets.bottom / 2;

  const infoSquareRect = rect(
    1,
    insets.bottom / 2,
    screen.width * 0.2,
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

export const gridSizeToMatrix = (size: GridSize): GridMatrix => {
  'worklet';
  return matrixToPoints(
    Array(size.rows)
      .fill(0)
      .map(() => Array(size.columns).fill(0)),
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
    cellsMatrix: matrixToPoints(matrix, config.defaultColor),
    name: 'Grid',
  };
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

export const drawGridMatrix = (
  gridMatrix: GridMatrix,
  gridConfig: Pick<GridConfig, 'size' | 'cell'>,
  showEmptyCells: boolean,
) => {
  'worklet';
  const surface = Skia.Surface.Make(gridConfig.size.width, gridConfig.size.height);
  const canvas = surface?.getCanvas();
  for (const cell of gridMatrix.flat()) {
    if (!showEmptyCells && cell.value === 0) continue;

    const skPath = Skia.Path.Make();
    skPath.addRRect(rrect(getCellUIRect(cell.point, gridConfig.cell.size), 3, 3));
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(cell.color));
    if (cell.value === 0) {
      paint.setStyle(PaintStyle.Stroke);
      paint.setColor(Skia.Color('white'));
      paint.setStrokeWidth(0.2);
      paint.setStrokeJoin(StrokeJoin.Round);
      paint.setStrokeCap(StrokeCap.Round);
      skPath.simplify();
      skPath.computeTightBounds();
    }
    canvas?.drawPath(skPath, paint);
  }
  surface?.flush();
  return surface?.makeImageSnapshot() ?? null;
};
