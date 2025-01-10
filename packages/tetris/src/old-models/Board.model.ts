import type { Block, BlockShape } from './Block.model';

export const ROW_POINTS = [40, 100, 300, 1200];

export type BoardCell = [Block | null, CellState];

/** Board 2D Matrix BoardCell[][] */
export type BoardMatrix = BoardCell[][];

export enum CellState {
  EMPTY = 0,
  MERGED = 1,
}

export interface BoardState {
  position: any;
  currentBlock: Block;
  currentShape: BlockShape;
  collided: boolean;
}

export interface BoardConfig {
  HEIGHT: number;
  WIDTH: number;
}

export enum _GameState {
  PLAYING = 0,
  STOP = 1,
}

export enum __TickSpeed {
  Normal = 800,
  Sliding = 200,
}
