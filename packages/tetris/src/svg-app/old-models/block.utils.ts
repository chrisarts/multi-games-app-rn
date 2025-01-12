import { type Block, type BlockShape, BlockShapes } from './Block.model';
import type { BoardCell } from './Board.model';

/**
 * @memberof `worklet`
 */
export const getBlockShape = (block: Block): BlockShape => {
  'worklet';
  return BlockShapes[block];
};

interface CellColors {
  backgroundColor: string;
  borderColor: string;
}
export const getCellColors = (cell: BoardCell): CellColors => {
  if (!cell[0])
    return {
      backgroundColor: 'lightgray',
      borderColor: 'lightgray',
    };
  return {
    backgroundColor: BlockShapes[cell[0]].color,
    borderColor: BlockShapes[cell[0]].color,
  };
};
