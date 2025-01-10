import * as Option from 'effect/Option';
import { BOARD_CONFIG } from '../utils/board.utils';
import * as GridUtils from '../utils/grid.utils';
import { BaseGridModel } from './Grid.model';
import type { GridPosition } from './GridPosition.model';

export class BoardGrid extends BaseGridModel {
  collided: boolean;

  constructor(
    readonly config: { width: number; height: number } = {
      width: BOARD_CONFIG.WIDTH,
      height: BOARD_CONFIG.HEIGHT,
    },
  ) {
    const layout = GridUtils.getGridLayout(config.width, config.height);
    super(layout);
    this.collided = false;
  }

  updateBoard(position: GridPosition, merge: boolean) {
    for (const point of this.currentBlock.toPoints()) {
      this.pointToCell(point).pipe(Option.map((cell) => cell.clear()));
    }
    this.currentBlock.updatePosition(position, false);
    for (const point of this.currentBlock.toPoints()) {
      this.pointToCell(point).pipe(
        Option.map((cell) => {
          cell.setColorFor(this.currentBlock);
          if (merge) cell.mergeCell();
        }),
      );
    }

    if (merge) this.toNextBlock();
  }
}
