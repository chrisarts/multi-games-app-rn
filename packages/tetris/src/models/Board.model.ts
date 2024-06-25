import { BlockShape, Block } from "./Block.model";
import { BoardPosition } from "./Point.model";

export type BoardCell = [Block | null, CellState];

/** Board 2D Matrix Cell[][] */
export type BoardMatrix = BoardCell[][];

export enum CellState {
  EMPTY,
  MERGED,
}

export interface BoardState {
  board: BoardMatrix;
  dropPosition: BoardPosition;
  droppingBlock: Block;
  droppingShape: BlockShape;
}

export interface BoardConfig {
  HEIGHT: number;
  WIDTH: number;
}
