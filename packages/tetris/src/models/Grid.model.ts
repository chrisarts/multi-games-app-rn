import * as HashMap from 'effect/HashMap';
import type * as HashSet from 'effect/HashSet';
import * as Match from 'effect/Match';
import { playerMoves, sumPositions } from '../utils';
import * as GridUtils from '../utils/grid.utils';
import { MoveDirection } from './Block.model';
import type { BoardPosition } from './Board.model';
import type { GridBlock } from './GridBlock.model';
import { type GridCell, GridPoint } from './GridCell.model';

export class BaseGridModel {
  readonly grid: HashMap.HashMap<GridPoint, GridCell>;
  readonly layout: GridUtils.GridLayout;
  gridPoints: HashSet.HashSet<GridPoint>;
  currentBlock: GridBlock;

  get getMovePosition() {
    return Match.type<MoveDirection>().pipe(
      Match.when(MoveDirection.UP, () => playerMoves.up(1)),
      Match.when(MoveDirection.DOWN, () => playerMoves.down(1)),
      Match.when(MoveDirection.LEFT, () => playerMoves.left(-1)),
      Match.when(MoveDirection.RIGHT, () => playerMoves.right(1)),
      // Match.when(MoveDirection.ROTATE, () => playerMoves.zero()),
      Match.orElse(() => playerMoves.zero()),
      (f) => (move: MoveDirection) => sumPositions(f(move), this.currentBlock.position),
    );
  }

  constructor(layout: GridUtils.GridLayout, block: GridBlock) {
    this.layout = layout;
    this.currentBlock = block;
    this.grid = GridUtils.createGrid({
      ...layout.config,
      layout,
    });
    this.gridPoints = HashMap.keySet(this.grid);
  }

  draw() {
    for (const point of this.currentBlock.toPoints()) {
      this.unsafePointToCell(point).setColorFor(this.currentBlock);
    }
  }

  unsafePointToCell(point: BoardPosition) {
    return HashMap.unsafeGet(this.grid, GridPoint.create(point));
  }

  pointToCell(point: BoardPosition) {
    return HashMap.get(this.grid, GridPoint.create(point));
  }

  setCurrentBlock(block: GridBlock) {
    this.currentBlock = block;
  }
}
