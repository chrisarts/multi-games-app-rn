import { keysOf } from "@games/shared";

export enum MoveDirection {
  LEFT,
  RIGHT,
  DOWN,
  UP,
  ROTATE,
}

export enum Block {
  O = "O",
  I = "I",
  J = "J",
  L = "L",
  S = "S",
  T = "T",
  Z = "Z",
}

export interface BlockShape {
  shape: number[][];
  color: string;
}

type ShapesObj = {
  [key in Block]: BlockShape;
};

export const BlockShapes: ShapesObj = {
  // 🟥
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "rgba(223, 217, 36,1)",
  },
  I: {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: "rgba(80, 227, 230, 1)",
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: "rgba(36, 95, 223,1)",
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: "rgba(223, 173, 36,1)",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "rgba(48, 211, 56,1)",
  },
  T: {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    color: "rgba(132, 61, 198,1)",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "rgba(227, 78, 78,1)",
  },
};

export const blockNames = keysOf(BlockShapes);

export const getRandomBlock = (): Block => {
  "worklet";
  const randomKey = blockNames[Math.floor(Math.random() * blockNames.length)];
  return randomKey;
};
