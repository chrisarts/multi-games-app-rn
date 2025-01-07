import type { SharedValue } from 'react-native-reanimated';
import type { Block, BlockShape, MoveDirection } from './Block.model';
import type { BoardMatrix, BoardPosition } from './Board.model';

export interface PlayerState {
  position: BoardPosition;
  currentBlock: Block;
  currentShape: BlockShape;
  collided: boolean;
}

export interface AnimatedPlayerState {
  position: SharedValue<BoardPosition>;
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
