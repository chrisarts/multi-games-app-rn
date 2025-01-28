import type { SkPoint } from '@shopify/react-native-skia';
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

const identity = (a: Tetromino): Tetromino => {
  'worklet';
  return {
    color: a.color,
    id: a.id,
    position: {
      x: a.position.x,
      y: a.position.y,
    },
    rotation: a.rotation,
    shape: a.shape,
    shapes: a.shapes,
  };
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

  return identity(TetrominoData.GameTetrominos[nextIndex]);
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
