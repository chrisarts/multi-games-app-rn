import * as Order from 'effect/Order';
import { CellState } from './Board.model';
import type { GridBlock } from './GridBlock.model';
import type { GridPosition } from './GridPosition.model';

interface GridCellProps {
  state: CellState;
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
  private state = CellState.EMPTY;
  store: GridCellProps;

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
    this.state = CellState.EMPTY;
    this.store = this.getStore();
  }

  mergeCell() {
    this.state = CellState.MERGED;
    this.store = this.getStore();
  }

  static order = Order.make<GridPosition>((a, b) => {
    if (a.id === b.id) {
      console.log('EQUALS: ', a);
      return 0;
    }

    if (a.x < b.x) return -1;
    if (a.x === b.x && a.y < b.y) return -1;

    return 1;
  });

  private getStore(): GridCellProps {
    return {
      state: this.state,
      svg: {
        x: this.point.y * this.layout.containerSize + this.layout.spacing / 2,
        y: this.point.x * this.layout.containerSize + this.layout.spacing / 2,
        height: this.layout.size,
        width: this.layout.size,
        color: this.color,
        style: 'fill',
        r: 5,
      },
    };
  }
}
