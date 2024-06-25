import { BlockShape, Block } from "./Block.model";

export interface BoardPosition {
  row: number;
  column: number;
}

export type BoardCell = [Block | null, CellState];

/** Board 2D Matrix BoardCell[][] */
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

export enum GameState {
  PLAYING,
  STOP,
}

export enum TickSpeed {
  Normal = 800,
  Sliding = 200,
}
