import { Block, BlockShape, BlockShapes } from "../models";

export const getBlockShape = (block: Block): BlockShape["shape"] => {
  return BlockShapes[block].shape;
};

export const getBlockColor = (block: Block): string => {
  return BlockShapes[block].color;
};
