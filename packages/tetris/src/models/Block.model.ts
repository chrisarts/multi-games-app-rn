import { Schema } from "@effect/schema";
import { keysOf } from "@games/shared";

export interface TetrisShape {
  shape: number[][];
  color: string;
}

const TetrisShapes = {
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "red",
  },
  I: {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: "blue",
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: "cyan",
  },

  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: "green",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "green",
  },
  T: {
    shape: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: "green",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "green",
  },
};

export const randomShape = () => {
  const shapesKeys = keysOf(TetrisShapes);
  const randomKey = shapesKeys[Math.floor(Math.random() * shapesKeys.length)];
  return TetrisShapes[randomKey];
};
