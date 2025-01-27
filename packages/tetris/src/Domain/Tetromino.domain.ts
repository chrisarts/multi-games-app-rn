import { type SkPoint, point } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import * as TetrominoData from '../Data/Tetrominos.data';

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

const lastTRandoms: [number, number, number] = [-1, -1, -1];
export const getRandomTetromino = (): Tetromino => {
  'worklet';
  let nextIndex = Math.floor(Math.random() * TetrominoData.TetrominoNames.length);
  while (lastTRandoms.includes(nextIndex)) {
    nextIndex = Math.floor(Math.random() * TetrominoData.TetrominoNames.length);
  }
  lastTRandoms[2] = lastTRandoms[1];
  lastTRandoms[1] = lastTRandoms[0];
  lastTRandoms[0] = nextIndex;
  const name = TetrominoData.TetrominoNames[nextIndex];
  const shape = TetrominoData.TetrominosData[name]();
  return createTetromino(shape);
};

export const generateBag = () => {
  'worklet';
  return [getRandomTetromino(), getRandomTetromino(), getRandomTetromino()];
};

export const createTetrominoManager = (bag: TetrominosBag) => {
  'worklet';
  return {
    fillBag: () => {
      'worklet';
      bag.value = generateBag();
    },
    nextTetromino: () => {
      'worklet';
      bag.modify((prev) => {
        'worklet';
        prev.push(getRandomTetromino());
        return prev;
      });
      const next = bag.value.shift()!;
      return next;
    },
  };
};
