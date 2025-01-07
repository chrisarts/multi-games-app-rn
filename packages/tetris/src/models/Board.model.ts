import type { Block, BlockShape } from './Block.model';

export const ROW_POINTS = [40, 100, 300, 1200];

export interface BoardPosition {
  row: number;
  column: number;
}

export type BoardCell = [Block | null, CellState];

/** Board 2D Matrix BoardCell[][] */
export type BoardMatrix = BoardCell[][];

export enum CellState {
  EMPTY = 0,
  MERGED = 1,
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
  PLAYING = 0,
  STOP = 1,
}

export enum TickSpeed {
  Normal = 800,
  Sliding = 200,
}
