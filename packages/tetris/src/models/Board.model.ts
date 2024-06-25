import { BlockShape, BlockNames } from "./Block.model";
import { BoardPosition } from "./Point.model";

export interface BoardCell {
  state: CellState;
  x: number;
  y: number;
  color: string | undefined;
}

/** Board 2D Matrix Cell[][] */
export type BoardMatrix = BoardCell[][];

export enum CellState {
  CLEAR,
  MERGED,
}

export interface BoardState {
  board: BoardMatrix;
  dropPosition: BoardPosition;
  droppingBlock: BlockNames;
  droppingShape: BlockShape;
}

export interface BoardConfig {
  HEIGHT: number;
  WIDTH: number;
}
