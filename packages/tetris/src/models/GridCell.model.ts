import * as Brand from 'effect/Brand';
import * as Order from 'effect/Order';
import type { GridBlock } from './GridBlock.model';
import type { GridPosition } from './GridPosition.model';

export type GridCellState = ('Merged' | 'Empty') & Brand.Brand<'GridCellState'>;
export const GridCellState = Brand.nominal<GridCellState>();

interface GridCellProps {
  state: GridCellState;
  svg: {
    x: number;
    y: number;
    height: number;
    width: number;
    r: number;
    color: string;
    style: 'fill';
  };
}

export interface GridCellLayout {
  size: number;
  containerSize: number;
  spacing: number;
}

export class GridCell {
  readonly _tag = 'GridCell';
  private readonly defaultColor = 'rgba(131, 126, 126, 0.3)';
  private color = this.defaultColor;
  private state = GridCellState('Empty');
  store: GridCellProps;

  get isMerged() {
    return this.state === GridCellState('Merged');
  }

  constructor(
    readonly point: GridPosition,
    readonly layout: GridCellLayout,
  ) {
    this.store = this.getStore();
  }

  setColorFor(shape: GridBlock) {
    // if (this.state === CellState.MERGED) return;
    this.color = shape.color;
    this.store = this.getStore();
  }

  clear() {
    this.color = this.defaultColor;
    this.state = GridCellState('Empty');
    this.store = this.getStore();
  }

  mergeCell() {
    this.state = GridCellState('Merged');
    this.store = this.getStore();
  }

  static order = Order.make<GridPosition>((a, b) => {
    if (a.id === b.id) {
      console.log('EQUALS: ', a);
      return 0;
    }

    if (a.row < b.row) return -1;
    if (a.row === b.row && a.column < b.column) return -1;

    return 1;
  });

  private getStore(): GridCellProps {
    return {
      state: this.state,
      svg: {
        x: this.point.column * this.layout.containerSize + this.layout.spacing / 2,
        y: this.point.row * this.layout.containerSize + this.layout.spacing / 2,
        height: this.layout.size,
        width: this.layout.size,
        color: this.color,
        style: 'fill',
        r: 5,
      },
    };
  }
}
