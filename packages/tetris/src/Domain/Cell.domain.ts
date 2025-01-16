import * as Equal from 'effect/Equal';
import * as Hash from 'effect/Hash';

import * as Position from './Position.domain';

const GameCellSymbolKey = 'tetris/cell';

export interface CellState {
  merged: boolean;
  color: string;
}

export const defaultCellColor: string = 'rgba(131, 126, 126, 0.3)';

export class Cell implements Equal.Equal {
  state: CellState = {
    merged: false,
    color: defaultCellColor,
  };
  constructor(readonly position: Position.Position) {}

  [Equal.symbol](that: unknown): boolean {
    return that instanceof Cell && Position.Eq.equals(this.position, that.position);
  }

  [Hash.symbol](): number {
    return Hash.cached(
      this,
      Hash.combine(Hash.hash(this.position))(Hash.hash(GameCellSymbolKey)),
    );
  }
}

export const makeCell = (position: Position.Position): Cell => new Cell(position);
