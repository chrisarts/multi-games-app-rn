import { point } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import * as TetrominoData from '../Data/Tetrominos.data';
import * as Grid from './Grid.domain';

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
    cells: Grid.matrixToPoints(shape.value),
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

export const rotateCells = (matrix: TetrominoData.TetrominoMatrix) => {
  'worklet';
  const nextMatrix = matrix
    .map((_, i) => matrix.map((column) => column[i]))
    .map((row) => row.reverse());

  const nextPoints = Grid.matrixToPoints(nextMatrix);
  return {
    nextMatrix,
    nextPoints,
  };
};

export const rotateTetromino = (
  tetromino: SharedValue<Grid.TetrisGrid>,
  position: { x: SharedValue<number>; y: SharedValue<number> },
  gridMatrix: Grid.TetrisAnimatedMatrix[][],
) => {
  'worklet';
  tetromino.set((prev) => {
    const { nextMatrix, nextPoints } = rotateCells(tetromino.value.matrix);
    const currentPos = point(position.x.value, position.y.value);
    const collisions = Grid.shapeCollisionsAt(currentPos, nextPoints, gridMatrix);

    if (!collisions.outsideGrid && !collisions.merge) {
      prev.matrix = nextMatrix;
      prev.cells = nextPoints;
    }
    return prev;
  });
};
