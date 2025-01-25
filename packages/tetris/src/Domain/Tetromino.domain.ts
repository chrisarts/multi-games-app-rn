import { type SkPoint, add, point } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import * as TetrominoData from '../Data/Tetrominos.data';
import * as Grid from './Grid.domain';

export interface TetrisCollision {
  at: SkPoint;
  merge: boolean;
  outsideGrid: boolean;
}

const mapToTetrisGrid = (
  shape: TetrominoData.TetrominoConfig,
  gridConfig: Grid.GridSize,
  cellSize: number,
  name: string,
): Grid.TetrisGrid => {
  'worklet';
  return {
    name,
    color: shape.color,
    matrix: shape.value,
    position: point(Math.floor((gridConfig.columns * cellSize) / 2), 0),
    cellsMatrix: Grid.matrixToPoints(shape.value, shape.color),
  };
};

export const getRandomTetromino = (
  gridConfig: Grid.GridSize,
  cellSize: number,
): Grid.TetrisGrid => {
  'worklet';
  const index = Math.floor(Math.random() * TetrominoData.TetrominoNames.length);
  const name = TetrominoData.TetrominoNames[index];
  const shape = TetrominoData.TetrominosData[name]();
  return mapToTetrisGrid(shape, gridConfig, cellSize, shape.name);
};

const checkShapeCollisions = (
  gridMatrix: SharedValue<Grid.GridMatrix>,
  at: SkPoint,
  shape: Grid.TetrisGrid,
) => {
  'worklet';
  for (const shapeCell of shape.cellsMatrix.flat()) {
    if (shapeCell.value === 0) continue;

    const gridPoint = add(at, shapeCell.point);
    const gridRow = gridMatrix.value[gridPoint.y];
    const gridCell = gridRow?.[gridPoint.x];

    if (gridPoint.x < 0 || typeof gridCell === 'undefined') {
      return {
        at: gridPoint,
        merge: gridPoint.y >= gridMatrix.value.length,
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

const addTetrominoToGrid = (
  gridMatrix: SharedValue<Grid.GridMatrix>,
  tetromino: Grid.TetrisGrid,
) => {
  'worklet';
  gridMatrix.set((prev) => {
    for (const cell of tetromino.cellsMatrix.flat()) {
      if (cell.value === 0) continue;
      const mergePoint = add(cell.point, tetromino.position);
      prev[mergePoint.y][mergePoint.x] = {
        color: cell.color,
        point: mergePoint,
        value: 1,
      };
    }

    let sweepLinesCount = 0;
    for (let row = prev.length - 1; row >= 0; row--) {
      const isRowFull = prev[row].every((cell) => cell.value > 0);
      if (isRowFull) {
        prev[row] = prev[row].map((x) => ({
          point: x.point,
          sweep: false,
          color: 'rgba(131, 126, 126, 0.3)',
          value: 0,
        }));
        sweepLinesCount++;
      } else if (sweepLinesCount > 0) {
        prev[row + sweepLinesCount] = prev[row].slice().map((cell) => ({
          ...cell,
          point: add(cell.point, point(0, sweepLinesCount)),
        }));
      }
    }
    return prev;
  });
};

export const createGridManager = (grid: SharedValue<Grid.GridMatrix>) => {
  'worklet';
  const checkCollisions = (at: SkPoint, shape: Grid.TetrisGrid) => {
    'worklet';
    return checkShapeCollisions(grid, at, shape);
  };
  const draw = (config: Grid.GridConfig) => {
    'worklet';
    return Grid.drawGridMatrix(grid.value, config);
  };
  const mergeTetromino = (tetromino: Grid.TetrisGrid) => {
    'worklet';
    addTetrominoToGrid(grid, tetromino);
  };

  return { checkCollisions, draw, mergeTetromino };
};

export const rotateTetromino = (shape: Grid.TetrisGrid): Grid.TetrisGrid => {
  'worklet';
  const nextMatrix = shape.matrix
    .map((_, iy) => shape.matrix.map((cells) => cells[iy]))
    .map((row) => row.toReversed());

  return {
    cellsMatrix: Grid.matrixToPoints(nextMatrix, shape.color),
    color: shape.color,
    matrix: nextMatrix,
    name: shape.name,
    position: shape.position,
  };
};
