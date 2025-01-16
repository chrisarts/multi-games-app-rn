import * as Equal from 'effect/Equal';
import * as Hash from 'effect/Hash';
import type { SharedValue } from 'react-native-reanimated';
import * as Position from './Position.domain';

const GameCellSymbolKey = 'tetris/cell';

export interface CellState {
  merged: boolean;
  color: string;
}

export interface AnimatedCellState {
  merged: boolean;
  /**
   * interpolation modes:
   * 0 - Default Color
   * 1 - Tetromino Color
   * */
  colorMode: SharedValue<number>;
}

export interface CellGameObj {
  id: string;
  x: SharedValue<number>;
  y: SharedValue<number>;
  r: number;
  color: string;
  mergeColor: SharedValue<number>;
  height: number;
  width: number;
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
