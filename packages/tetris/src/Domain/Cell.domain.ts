import * as Equal from 'effect/Equal';
import * as Hash from 'effect/Hash';
// import { makeMutable } from 'react-native-reanimated';
// import type { Mutable } from 'react-native-reanimated/lib/typescript/commonTypes';
import type { GridLayout } from './Layout.domain';
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
  // animated: {
  //   color: Mutable<string>;
  //   merge: Mutable<boolean>;
  // };
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

export const setColor = (cell: Cell, color: string) =>
  (cell.state = {
    ...cell.state,
    color,
  });

export const getCellSvg = (position: Position.Position, layout: GridLayout['cell']) => ({
  x: position.column * layout.containerSize + layout.spacing / 2,
  y: position.row * layout.containerSize + layout.spacing / 2,
  height: layout.size,
  width: layout.size,
  style: 'fill',
  r: 5,
});
