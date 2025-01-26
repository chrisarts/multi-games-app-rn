import { type SkPoint, point } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import * as TetrominoData from '../Data/Tetrominos.data';
import * as Grid from './Grid.domain';

export interface TetrisCollision {
  at: SkPoint;
  merge: boolean;
  outsideGrid: boolean;
}

export type TetrominosBag = SharedValue<Tetromino[]>;
export interface Tetromino {
  id: number;
  shapes: SkPoint[][];
  shape: SkPoint[];
  color: string;
  position: SkPoint;
  rotation: number;
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

export const rotateTetromino = (shape: Tetromino): Tetromino => {
  'worklet';
  let rotation = shape.rotation + 1;
  if (rotation === shape.shapes.length - 1) {
    rotation = 0;
  }

  return {
    color: shape.color,
    id: shape.id,
    rotation,
    shape: shape.shapes[rotation],
    shapes: shape.shapes,
    position: shape.position,
  };
};

const createTetromino = (config: TetrominoData.TetrominoConfig): Tetromino => {
  'worklet';
  const shapes = [config.value];

  let stop = false;
  while (!stop) {
    const lastShape = shapes[shapes.length - 1];
    const nextShape = lastShape
      .map((_, iy) => lastShape.map((cells) => cells[iy]))
      .map((row) => row.toReversed());

    const nextShapeID = nextShape.flat().join('');
    stop = shapes.some((shape) => shape.flat().join('') === nextShapeID);
    shapes.push(nextShape);
  }

  const allShapes = shapes.map((shape) =>
    shape
      .flatMap((row, iy) => row.map((_, ix) => (_ > 0 ? point(ix, iy) : null)))
      .filter((_) => _ !== null),
  );
  const maxX = allShapes[0].sort((a, b) => b.x - a.x)[0].x + 1;
  const maxY = allShapes[0].sort((a, b) => b.y - a.y)[0].y + 1;

  return {
    color: config.color,
    id: Object.keys(TetrominoData.TetrominosData).indexOf(config.name) + 1,
    shapes: allShapes,
    position: point(maxX > maxY ? maxX : maxY, 0),
    shape: allShapes[0],
    rotation: 0,
  };
};

export const generateBag = () => {
  'worklet';
  const bag: Tetromino[] = [];
  for (const config of TetrominoData.TetrominoNames) {
    bag.push(createTetromino(TetrominoData.TetrominosData[config]()));
  }
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i * 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

const fillBag = (bag: TetrominosBag) => {
  'worklet';
  bag.value = generateBag();
};

export const createTetrominoManager = (bag: TetrominosBag) => {
  'worklet';
  return {
    fillBag: () => {
      'worklet';
      fillBag(bag);
    },
    nextTetromino: () => {
      'worklet';
      if (bag.value.length === 0) {
        fillBag(bag);
      }
      return bag.value.pop()!;
    },
  };
};
