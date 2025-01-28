import {
  PaintStyle,
  type SkImage,
  type SkPoint,
  Skia,
  StrokeCap,
  StrokeJoin,
  add,
  point,
  rect,
  rrect,
} from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TetrominoColors } from '../../Data/Tetrominos.data';
import {
  type GridConfig,
  type GridMatrix,
  getGridConfig,
  gridSizeToMatrix,
} from '../../Domain/Grid.domain';
import type { Tetromino } from '../../Domain/Tetromino.domain';

export const useBoardState = () => {
  const showHiddenCells = useSharedValue(true);
  const boardSize = useSharedValue({ columns: 10, rows: 22 });
  const boardImage = useSharedValue<SkImage | null>(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const gridConfig = useDerivedValue(() =>
    getGridConfig(dimensions, insets, boardSize.value),
  );

  const matrix = useSharedValue(
    gridSizeToMatrix(boardSize.value, gridConfig.value.cell.size),
  );

  const reset = () => {
    'worklet';
    matrix.value = gridSizeToMatrix(gridConfig.value, gridConfig.value.cell.size);
  };

  const checkCollisions = (at: SkPoint, tetromino: Tetromino) => {
    'worklet';
    for (const shapeCell of tetromino.shapes[tetromino.rotation]) {
      const gridPoint = add(at, shapeCell);
      const gridRow = matrix.value[gridPoint.y];
      const gridCell = gridRow?.[gridPoint.x];

      if (gridPoint.x < 0 || typeof gridCell === 'undefined') {
        return {
          at: gridPoint,
          merge: gridPoint.y >= matrix.value.length,
          outsideGrid: true,
        };
      }

      if (gridCell.value > 0) {
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
      at,
    };
  };

  const isOccupiedCell = (point: SkPoint) => {
    'worklet';
    return matrix.value[point.y][point.x].value > 0;
  };

  const isRowFull = (row: number) => {
    'worklet';
    return matrix.value[row].every((cell) => isOccupiedCell(cell));
  };

  // const setCellValue = (at: SkPoint, value: number) => {
  //   'worklet';
  //   matrix.value[at.y][at.x].value = value;
  // };

  // const isRowEmpty = (row: number) => {
  //   'worklet';
  //   return matrix.value[row].every((cell) => !isOccupiedCell(cell));
  // };

  const moveCellDown = (at: SkPoint, toRow: number) => {
    'worklet';
    const cell = matrix.value[at.y][at.x];
    return { ...cell, y: cell.y + toRow };
  };

  const draw = () => {
    'worklet';
    boardImage.value?.dispose();
    boardImage.value = drawBoard(matrix.value, gridConfig.value, showHiddenCells.value);
  };
  draw();

  const mergeTetromino = (tetromino: Tetromino, at: SkPoint) => {
    'worklet';
    let sweepLinesCount = 0;
    const grid = matrix.value;
    for (const cell of tetromino.shapes[tetromino.rotation]) {
      const mergePoint = add(cell, at);
      grid[mergePoint.y][mergePoint.x] = {
        x: mergePoint.x,
        y: mergePoint.y,
        value: tetromino.id,
      };
    }

    for (let row = grid.length - 1; row >= 0; row--) {
      if (isRowFull(row)) {
        grid[row] = grid[row].map(({ x, y }) => ({ x, y, value: 0 }));
        sweepLinesCount++;
      } else if (sweepLinesCount > 0) {
        const moveRow = row + sweepLinesCount;
        grid[moveRow] = grid[row]
          .slice()
          .map((cell) => moveCellDown(cell, sweepLinesCount));
      }
    }
    draw();
    return sweepLinesCount;
  };

  const getDistance = (at: SkPoint) => {
    'worklet';
    let distance = 0;
    do {
      ++distance;
    } while (!isOccupiedCell(point(at.x, distance + 1)));

    return distance;
  };

  return {
    grid: matrix,
    gridConfig,
    boardImage,
    boardSize,
    showHiddenCells,
    reset,
    checkCollisions,
    mergeTetromino,
    getDistance,
  };
};

const drawBoard = (
  matrix: GridMatrix,
  gridConfig: GridConfig,
  showHiddenCells: boolean,
) => {
  'worklet';
  const surface = Skia.Surface.Make(gridConfig.size.width, gridConfig.size.height);
  const canvas = surface?.getCanvas();
  if (!surface || !canvas) return null;

  for (const cell of matrix.flat()) {
    if (!showHiddenCells && cell.value === 0) continue;

    const skPath = Skia.Path.Make();
    const cellRect = rect(
      cell.x * gridConfig.cell.size,
      cell.y * gridConfig.cell.size,
      gridConfig.cell.size - 1,
      gridConfig.cell.size - 1,
    );
    skPath.addRRect(rrect(cellRect, 5, 5));
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(TetrominoColors[cell.value] ?? 'white'));

    if (cell.value === 0) {
      paint.setStyle(PaintStyle.Stroke);
      paint.setStrokeWidth(0.2);
      paint.setStrokeJoin(StrokeJoin.Round);
      paint.setStrokeCap(StrokeCap.Round);
      skPath.simplify();
      skPath.computeTightBounds();
    }
    canvas.drawPath(skPath, paint);
  }

  surface.flush();
  return surface.makeImageSnapshot() ?? null;
};
