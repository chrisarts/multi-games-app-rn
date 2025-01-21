import { type Vector, vec } from '@shopify/react-native-skia';
import * as TetrominoData from '../Data/Tetrominos.data';
import * as Grid from './Grid.domain';

export const getShapeBounds = (vectors: Vector[], gridConfig: Grid.GridConfig) => {
  'worklet';
  // const sortX = vectors.map(({ x, y }) => ({ x: x, y: y })).sort((a, b) => a.x - b.x);
  // const sortY = vectors.map(({ x, y }) => ({ x: x, y: y })).sort((a, b) => a.y - b.y);

  const maxX = Math.max(...vectors.map(({ x }) => x));
  const maxY = Math.max(...vectors.map(({ y }) => y));

  return {
    maxX: maxX * gridConfig.cellContainerSize,
    maxY: maxY * gridConfig.cellContainerSize,
  };
};

const mapToTetrisGrid = (
  shape: TetrominoData.TetrominoConfig,
  gridConfig: Grid.GridConfigInput,
  cellSize: number,
  name: string,
): Grid.TetrisGrid => {
  'worklet';
  return {
    name,
    color: shape.color,
    matrix: shape.value,
    position: vec(Math.floor((gridConfig.columns * cellSize) / 2), 0),
    cells: Grid.matrixToPoints(shape.value),
  };
};

export const getAllTetrominos = (gridConfig: Grid.GridConfigInput, cellSize: number) => {
  'worklet';
  return Object.values(TetrominoData.TetrominosData).map((shape) => {
    return mapToTetrisGrid(shape, gridConfig, cellSize, shape._tag);
  });
};

export const getRandomTetromino = (
  gridConfig: Grid.GridConfigInput,
  cellSize: number,
): Grid.TetrisGrid => {
  'worklet';
  const shape =
    TetrominoData.TetrominosData[
      TetrominoData.TetrominoNames[
        Math.floor(Math.random() * TetrominoData.TetrominoNames.length)
      ]
    ];
  return mapToTetrisGrid(shape, gridConfig, cellSize, shape._tag);
};
