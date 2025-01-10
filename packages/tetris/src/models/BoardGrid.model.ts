import { type CustomStore, createStore } from '@games/shared';
import * as HashMap from 'effect/HashMap';
import type * as HashSet from 'effect/HashSet';
import * as Option from 'effect/Option';
import { sumPositions } from '../utils';
import { BOARD_CONFIG } from '../utils/board.utils';
import * as GridUtils from '../utils/grid.utils';
import { type BoardPosition, CellState } from './Board.model';
import { BaseGridModel } from './Grid.model';
import type { GridBlock } from './GridBlock.model';
import { GridPoint } from './GridCell.model';

export class BoardGrid extends BaseGridModel {
  collided: boolean;
  currentShape: GridBlock;
  nextShape: GridBlock;

  constructor(
    readonly config: { width: number; height: number } = {
      width: BOARD_CONFIG.WIDTH,
      height: BOARD_CONFIG.HEIGHT,
    },
  ) {
    const layout = GridUtils.getGridLayout(config.width, config.height);
    const block = GridUtils.getRandomShape(layout.initialPosition);
    super(layout, block);
    this.currentShape = block;
    this.nextShape = GridUtils.getRandomShape(this.layout.initialPosition);
    this.collided = false;
  }

  mergeCurrentShape() {
    for (const point of this.currentShape.toPoints()) {
      this.unsafePointToCell(point).mergeCell();
    }
  }

  hasCollide(moveSum: BoardPosition) {
    const currentPoints = this.currentBlock.toPoints();
    const nextPoints = this.currentBlock.toPoints(GridPoint.create(moveSum));

    const nextCells = nextPoints.map((point) =>
      HashMap.get(this.grid, point).pipe(
        Option.flatMap(
          Option.liftPredicate((cell) => cell.store.state !== CellState.MERGED),
        ),
      ),
    );
    const collide = nextCells.some((x) => Option.isNone(x));
    return {
      currentPoints,
      nextPoints,
      nextCells,
      collide,
    };
  }

  refresh() {
    this.updateBoard(GridPoint.create(this.currentBlock.position), false);
  }

  updateBoard(position: GridPoint, collide: boolean) {
    for (const point of this.currentShape.toPoints()) {
      this.unsafePointToCell(point).clear();
    }
    this.currentShape.updatePosition(position);
    for (const point of this.currentShape.toPoints()) {
      const foundCell = this.unsafePointToCell(point);
      foundCell.setColorFor(this.currentShape);
    }
  }
}
