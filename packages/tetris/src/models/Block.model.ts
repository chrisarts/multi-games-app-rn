import { keysOf } from "@games/shared";

export interface BlockShape {
  shape: number[][];
  color: string;
  name: BlockNames;
}

export const BlockShapes = {
  // 🟥
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "gold",
    name: "O",
  },
  I: {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: "purple",
    name: "I",
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: "gray",
    name: "J",
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: "red",
    name: "L",
  },
  S: {
    shape: [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "blueviolet",
    name: "S",
  },
  T: {
    shape: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: "orange",
    name: "T",
  },
  Z: {
    shape: [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "darkblue",
    name: "Z",
  },
};

export const blockNames = keysOf(BlockShapes);

export type BlockNames = (typeof blockNames)[number];

export const getRandomBlock = (): BlockShape => {
  const randomKey = blockNames[Math.floor(Math.random() * blockNames.length)];
  return BlockShapes[randomKey] as BlockShape;
};
