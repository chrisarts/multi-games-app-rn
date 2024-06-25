export interface TetrisBoardCell {
  state: CellState;
  x: number;
  y: number;
}

export enum CellState {
  CLEAR,
  MERGED,
}
