import * as HashMap from 'effect/HashMap';
import type * as HashSet from 'effect/HashSet';
import * as Option from 'effect/Option';
import { CellState } from '../old-models/Board.model';
import * as GridUtils from '../utils/grid.utils';
import {
  CollisionResult,
  type MoveDirection,
  getMoveDirectionUnit,
} from './Action.model';
import type { GridBlock } from './GridBlock.model';
import type { GridCell } from './GridCell.model';
import { GridPosition } from './GridPosition.model';

export class BaseGridModel {
  readonly _tag = 'GridModel';
  readonly grid: HashMap.HashMap<GridPosition, GridCell>;
  readonly layout: GridUtils.GridLayout;
  gridPoints: HashSet.HashSet<GridPosition>;
  currentBlock: GridBlock;
  nextBlock: GridBlock;

  getMovePosition(move: MoveDirection) {
    return getMoveDirectionUnit(move).sum(this.currentBlock.currentPosition);
  }

  constructor(layout: GridUtils.GridLayout) {
    this.layout = layout;
    this.currentBlock = GridUtils.getRandomShape(layout.initialPosition);
    this.grid = GridUtils.createGrid(layout);
    this.gridPoints = HashMap.keySet(this.grid);
    this.nextBlock = GridUtils.getRandomShape(layout.initialPosition);
  }

  draw() {
    for (const point of this.currentBlock.toPoints()) {
      this.pointToCell(point).pipe(
        Option.map((cell) => cell.setColorFor(this.currentBlock)),
      );
    }
  }

  pointToCell(point: GridPosition) {
    return HashMap.get(this.grid, point);
  }

  toNextBlock() {
    this.currentBlock = this.nextBlock;
    this.nextBlock = GridUtils.getRandomShape(this.layout.initialPosition);
  }

  checkMoveCollision(move: MoveDirection): CollisionResult {
    const toPosition = this.getMovePosition(move);
    const toPoint = GridPosition.create(toPosition);
    const nextPoints = this.currentBlock.toPoints(toPoint);

    for (const point of nextPoints) {
      const checkCollision = this.pointHasCollision(point);
      if (checkCollision) return checkCollision;
    }

    return CollisionResult.CLEAR({ toPoint });
  }

  clearEmptyCells() {
    HashMap.forEach(this.grid, (value) => {
      if (value.store.state === CellState.EMPTY) value.clear();
    });
  }

  pointHasCollision(point: GridPosition) {
    const cell = this.pointToCell(point);
    const boundsOut = this.pointOutOfGrid(point);

    if (Option.isNone(cell)) {
      return CollisionResult.LIMIT_REACHED({
        gameOver: boundsOut.up,
        merge: boundsOut.down,
      });
    }

    if (cell.value.store.state === CellState.MERGED) {
      return CollisionResult.MERGED_SIBLING({
        sibling: cell.value,
        gameOver: point.x <= 1,
      });
    }
  }

  private pointOutOfGrid(point: GridPosition) {
    return {
      right: point.y >= this.layout.config.rows,
      left: point.y <= 0,
      up: point.x <= 1,
      down: point.x >= this.layout.config.columns,
    };
  }
}
