import type { SharedValue } from 'react-native-reanimated';
import type { MoveDirection } from './Action.model';
import type { Block, BlockShape } from './Block.model';
import type { BoardMatrix } from './Board.model';
import type { GridPosition } from './GridPosition.model';

export interface PlayerState {
  position: GridPosition;
  currentBlock: Block;
  currentShape: BlockShape;
  collided: boolean;
}

export interface AnimatedPlayerState {
  position: SharedValue<GridPosition>;
  currentBlock: SharedValue<Block>;
  currentShape: SharedValue<BlockShape>;
  nextBlock: SharedValue<Block>;
  nextShape: SharedValue<BlockShape>;
  collided: SharedValue<boolean>;
}

export interface PlayerMoveAction {
  dir: MoveDirection;
  value: number;
  board: BoardMatrix;
}
