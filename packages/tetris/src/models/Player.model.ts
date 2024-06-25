import { Block, BlockShape, MoveDirection } from "./Block.model";
import { BoardMatrix, BoardPosition } from "./Board.model";

export interface PlayerState {
  position: BoardPosition;
  currentBlock: Block;
  currentShape: BlockShape;
  collided: boolean;
}

export interface PlayerMoveAction {
  dir: MoveDirection;
  value: number;
  board: BoardMatrix;
}
