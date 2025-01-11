import * as GridUtils from '../utils/grid.utils';
import type * as Actions from './Action.model';
import { BaseGridModel } from './Grid.model';

export interface BoardConfig {
  /** height */
  readonly rows: number;
  /** width */
  readonly columns: number;
}
export const DefaultBoardConfig: BoardConfig = {
  rows: 15,
  columns: 10,
};

export class BoardGrid extends BaseGridModel {
  collided: boolean;

  constructor(readonly config: BoardConfig = DefaultBoardConfig) {
    const layout = GridUtils.getGridLayout(config);
    super(layout);
    this.collided = false;
  }

  moveBlock(move: Actions.MoveDirection) {
    const movePoint = this.getMovePosition(move);

    if (movePoint.column > this.board.layout.config.columns) {
      this.updateBoard(this.player.dropPosition, true);
      return this.state;
    }

    return this.state;
  }

  // private updateStateForCollideState(
  //   collision: Actions.CollisionResult,
  //   movePoint: GridPosition,
  // ) {
  //   Match.value(collision).pipe(
  //     Match.when({ _tag: 'CLEAR' }, ({ toPoint }) => {
  //       this.updateBoard(toPoint, false);
  //     }),
  //     Match.when(
  //       {
  //         gameOver: true,
  //       },
  //       () => {
  //         this.mutatePlayer({
  //           runState: Actions.GameRunState('Stop'),
  //         });
  //       },
  //     ),
  //     Match.when({ _tag: 'LIMIT_REACHED' }, ({ merge }) => {
  //       if (merge) this.updateBoard(this.player.dropPosition, merge);
  //     }),
  //     Match.when({ _tag: 'MERGED_SIBLING' }, ({ merge }) => {
  //       this.updateBoard(this.player.dropPosition, merge);
  //     }),
  //     Match.exhaustive,
  //   );
  // }
}
