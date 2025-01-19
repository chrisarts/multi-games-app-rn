import { type Vector, bounds, vec } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import * as TetrominoData from '../Data/Tetrominos.data';
import * as Grid from './Grid.domain';

export const getShapePosition = (
  position: Vector,
  shape: SharedValue<Grid.TetrisGrid>,
  cellSize: number,
) => {
  'worklet';
  const shapeBounds = bounds(shape.value.cells);

  const shapePos = {
    left: position.x,
    right: Math.ceil(position.x + shapeBounds.width / 2),
    top: position.y,
    bottom: Math.floor(position.y + shapeBounds.height),
  };

  const shapeCoords = {
    left: Math.floor(shapePos.left / cellSize),
    right: Math.floor(shapePos.right / cellSize),
    top: Math.floor(shapePos.top / cellSize),
    bottom: Math.floor(shapePos.bottom / cellSize),
  };

  return {
    shapePos,
    shapeCoords,
  };
};

export const checkCollisions = (
  position: Vector,
  shape: SharedValue<Grid.TetrisGrid>,
  gridConfig: Grid.GridConfig,
) => {
  'worklet';
  const { shapeCoords, shapePos } = getShapePosition(
    position,
    shape,
    gridConfig.cellContainerSize,
  );

  return {
    shapePos,
    shapeCoords,
    wall: {
      left: shapeCoords.left === 0,
      top: shapeCoords.top === 0,
      right: shapeCoords.right >= gridConfig.columns,
      bottom: shapeCoords.bottom >= gridConfig.rows,
    },
  };
};

const mapToTetrisGrid = (
  shape: TetrominoData.TetrominoConfig,
  gridConfig: Grid.GridConfigInput,
  cellSize: number,
  name: string,
): Grid.TetrisGrid => {
  'worklet';
  const vectors = shape.value
    .flatMap((_, y) => _.map((col, x) => (col === 1 ? vec(x, y) : null)))
    .filter((x) => x !== null)
    .sort((v1, v2) => v1.x - v2.x);

  // const rects = vectors.map((vector) => Grid.getCellUIRect(vector, cellSize));

  return {
    name,
    // bounds: Sk.bounds(rects.flat()),
    color: shape.color,
    cells: vectors.map((vector) => Grid.getCellUIRect(vector, cellSize)),
    matrix: shape.value,
    position: vec(Math.floor((gridConfig.columns * cellSize) / 2), 0),
    // rects,
    vectors,
    // skPath: Grid.createGridUIPath(rects),
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
