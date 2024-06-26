import { Block, BlockShape, BlockShapes, BoardCell } from "../models";

export const getBlockShape = (block: Block): BlockShape => {
  "worklet";
  return BlockShapes[block];
};

interface CellColors {
  backgroundColor: string;
  borderColor: string;
}
export const getCellColors = (cell: BoardCell): CellColors => {
  if (!cell[0])
    return {
      backgroundColor: "lightgray",
      borderColor: "lightgray",
    };
  return {
    backgroundColor: BlockShapes[cell[0]].color,
    borderColor: BlockShapes[cell[0]].color,
  };
};
