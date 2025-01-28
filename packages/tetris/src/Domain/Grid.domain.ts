import {
  PaintStyle,
  type Size,
  type SkPoint,
  type SkRect,
  Skia,
  StrokeCap,
  StrokeJoin,
  add,
  point,
  rect,
  rrect,
} from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { TetrominoColors } from '../Data/Tetrominos.data';
import type { Tetromino } from './Tetromino.domain';

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

export const drawGridMatrix = (
  gridMatrix: GridMatrix,
  gridConfig: GridConfig,
  showEmptyCells: boolean,
) => {
  'worklet';
  const surface = Skia.Surface.Make(gridConfig.size.width, gridConfig.size.height);
  const canvas = surface?.getCanvas();

  for (const cell of gridMatrix.flat()) {
    if (!showEmptyCells && cell.value === 0) continue;

    const skPath = Skia.Path.Make();
    // skPath.addRRect(rrect(getCellUIRect(cell.point, gridConfig.cell.size), 3, 3));
    const cellRect = rect(
      cell.x * gridConfig.cell.size,
      cell.y * gridConfig.cell.size,
      gridConfig.cell.innerSize,
      gridConfig.cell.innerSize,
    );
    skPath.addRRect(rrect(cellRect, 3, 3));
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(TetrominoColors[cell.value] ?? 'white'));

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

const addTetrominoToGrid = (
  gridMatrix: SharedValue<GridMatrix>,
  tetromino: Tetromino,
) => {
  'worklet';
  let sweepLinesCount = 0;
  gridMatrix.modify((prev) => {
    'worklet';
    for (const cell of tetromino.shapes[tetromino.rotation]) {
      const mergePoint = add(cell, tetromino.position);
      prev[mergePoint.y][mergePoint.x] = {
        x: mergePoint.x,
        y: mergePoint.y,
        value: tetromino.id,
      };
    }

    for (let row = prev.length - 1; row >= 0; row--) {
      const isRowFull = prev[row].every((cell) => cell.value > 0);
      if (isRowFull) {
        prev[row] = prev[row].map(({ x, y }) => ({ x, y, value: 0 }));
        sweepLinesCount++;
      } else if (sweepLinesCount > 0) {
        prev[row + sweepLinesCount] = prev[row].slice().map((cell) => ({
          ...cell,
          point: add(point(cell.x, cell.y), point(0, sweepLinesCount)),
        }));
      }
    }
    return prev;
  });
  return sweepLinesCount;
};

export const createGridManager = (grid: SharedValue<GridMatrix>) => {
  'worklet';
  const draw = (config: GridConfig, showEmptyCells = false) => {
    'worklet';
    return drawGridMatrix(grid.value, config, showEmptyCells);
  };
  const mergeTetromino = (tetromino: Tetromino) => {
    'worklet';
    return addTetrominoToGrid(grid, tetromino);
  };

  return { draw, mergeTetromino };
};
