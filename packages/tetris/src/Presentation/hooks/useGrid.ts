import { type SkImage, type SkPoint, point, rect, vec } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { type SharedValue, useSharedValue } from 'react-native-reanimated';
import type { TetrominoMatrix } from '../../Data/Tetrominos.data';
import * as Grid from '../../Domain/Grid.domain';

export const useGrid = () => {
  const screen = useWindowDimensions();
  const gridConfig = Grid.getGridConfig(screen.width, { rows: 15, columns: 10 });
  const tetrisGrid = Grid.getGridLayout(gridConfig, gridConfig);
  const mergedTetrominos = useSharedValue<Grid.TetrisGrid[]>([]);
  const mergedShapesTexture = useSharedValue<SkImage | null>(null);

  const tetrisGridCells = tetrisGrid.cells.map((vector) => ({
    color: useSharedValue(tetrisGrid.color),
    rect: Grid.getCellUIRect(vector.point, gridConfig.cellContainerSize),
    coords: vector,
  }));

  const matrix = tetrisGrid.matrix.map((row, iy) =>
    row.map((column, ix) => ({
      point: vec(ix, iy),
      value: useSharedValue(column),
      color: useSharedValue('rgba(131, 126, 126, 0.3)'),
    })),
  );

  const gridClip = useMemo(
    () =>
      rect(
        gridConfig.cellSpacing,
        gridConfig.cellSpacing,
        gridConfig.width,
        gridConfig.height,
      ),
    [gridConfig],
  );

  const isInsideGrid = ({ x, y }: SkPoint) => {
    'worklet';
    return x >= 0 && x < gridConfig.columns && y < gridConfig.rows;
  };

  const isFreePosition = ({ x, y }: SkPoint) => {
    'worklet';
    const row = matrix[y];
    if (!row) return false;
    const cell = matrix[y][x];
    if (!cell) return false;

    return matrix[y][x].value.value === 0;
  };

  const isValidPosition = (at: SkPoint, matrix: TetrominoMatrix) => {
    'worklet';
    return matrix.every((row, dy) => {
      'worklet';
      return row.every((value, dx) => {
        'worklet';
        const x = Math.floor(at.x + dx);
        const y = Math.floor(at.y + dy);
        return value === 0 || (isInsideGrid(point(x, y)) && isFreePosition(point(x, y)));
      });
    });
  };

  const drawShape = (shape: SharedValue<Grid.TetrisGrid>, position: SkPoint) => {
    'worklet';
    shape.value.matrix.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value > 0) {
          const cell = matrix[dy + position.y][dx + position.x];
          cell.color.value = shape.value.color;
          cell.value.value = value;
        }
      });
    });
  };

  const clearLines = () => {
    'worklet';
    const clearedLines = matrix.filter((row, i) =>
      row.every((cell) => cell.value.value > 0),
    );
    for (const line of clearedLines) {
      const lineIndex = matrix.indexOf(line);
      for (let idy = lineIndex; idy < matrix.length; ++idy) {
        const nextLine = matrix[idy + 1];
        for (const cell of nextLine) {
          const nextCellIndex = nextLine.indexOf(cell);
          cell.color.value = line[nextCellIndex].color.value;
          cell.value.value = line[nextCellIndex].value.value;
        }
      }
    }
    console.log('CLEARED_LINES: ', clearedLines.length);
  };

  return {
    screen,
    matrix,
    gridConfig,
    gridClip,
    tetrisGrid,
    mergedTetrominos,
    mergedShapesTexture,
    tetrisGridCells,
    isValidPosition,
    drawShape,
    clearLines,
  };
};
