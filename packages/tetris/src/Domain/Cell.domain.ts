import { Skia, rect, rrect } from '@shopify/react-native-skia';
import * as Equal from 'effect/Equal';
import * as Hash from 'effect/Hash';
import type { SharedValue } from 'react-native-reanimated';
import type * as Grid from './Grid.domain';
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

export const setColor = (cell: Cell, color: string) =>
  (cell.state = {
    ...cell.state,
    color,
  });

export const getCellSvg = (position: Position.Position, layout: Grid.CellLayout) => ({
  x: position.column * layout.containerSize + layout.spacing / 2,
  y: position.row * layout.containerSize + layout.spacing / 2,
  height: layout.size,
  width: layout.size,
  style: 'fill',
  r: 5,
});

export const calculateUICellDraw = (
  position: Position.Position,
  cellLayout: Grid.CellLayout,
) => {
  'worklet';
  const x = position.column * cellLayout.containerSize + cellLayout.spacing / 2;
  const y = position.row * cellLayout.containerSize + cellLayout.spacing / 2;
  const width = cellLayout.containerSize - cellLayout.spacing / 2;
  const height = cellLayout.containerSize - cellLayout.spacing / 2;
  return {
    x,
    y,
    width,
    height,
  };
};

export const createCellUIRect = (position: Position.Position, cellLayout: Grid.CellLayout) => {
  'worklet';
  const { x, y, width, height } = calculateUICellDraw(position, cellLayout);
  return rect(x, y, width, height);
};

export const createCellUIRRect = (
  position: Position.Position,
  cellLayout: Grid.CellLayout,
) => {
  return rrect(createCellUIRect(position, cellLayout), 5, 5);
};

export const createCanvasUIPath = (grid: Grid.GridState) => {
  'worklet';
  const path = Skia.Path.Make();
  for (const position of grid.positions) {
    const cell = createCellUIRect(position, grid.layout.cell);
    path.addRRect(rrect(rect(cell.x, cell.y, cell.width, cell.height), 5, 5));
  }
  path.close();
  return path;
};
