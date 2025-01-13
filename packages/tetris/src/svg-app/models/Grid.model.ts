import * as RA from 'effect/Array';
import * as HashMap from 'effect/HashMap';
import type * as HashSet from 'effect/HashSet';
import * as Option from 'effect/Option';
import { GameRunState } from '../../Domain/Game.domain';
import * as GridUtils from '../../utils/grid.utils';
import { debugObjectLog } from '../../utils/log.utils';
import * as Actions from './Action.model';
import type { GridBlock } from './GridBlock.model';
import type { GridCell } from './GridCell.model';
import { GridPosition } from './GridPosition.model';

interface TetrisGameState {
  board: {
    cellsMap: HashMap.HashMap<GridPosition, GridCell>;
    gridPositions: HashSet.HashSet<GridPosition>;
    layout: GridUtils.GridLayout;
  };
  player: {
    score: number;
    clearedRows: number;
    level: number;
    runState: GameRunState;
    speed: number;
    dropPosition: GridPosition;
    currentBlock: GridBlock;
    nextBlock: GridBlock;
  };
}

export abstract class BaseGridModel {
  readonly _tag = 'GridModel';
  /** @category mutable state */
  state: TetrisGameState;

  // MARK: Computed props
  /** @category computed */
  protected get board() {
    return this.state.board;
  }
  /** @category computed */
  protected get player() {
    return this.state.player;
  }
  /** @category computed */
  protected get currentShapePoints() {
    return this.player.currentBlock.getGridPointsAt(this.player.dropPosition);
  }
  /** @category computed */
  protected get currentPosition() {
    return this.player.dropPosition;
  }
  /** @category computed */
  protected get layout() {
    return this.state.board.layout;
  }
  protected get gridBounds() {
    return {
      max: GridPosition.create({
        row: this.layout.config.rows,
        column: this.layout.config.columns,
      }),
      min: Actions.getMoveDirectionUnit(Actions.MoveDirection('zero')),
    };
  }

  constructor(layout: GridUtils.GridLayout) {
    const cellsMap = GridUtils.createGrid(layout);
    const currentBlock = GridUtils.getRandomShape();
    const nextBlock = GridUtils.getRandomShape();
    this.state = {
      board: {
        cellsMap: cellsMap,
        layout,
        gridPositions: HashMap.keySet(cellsMap),
      },
      player: {
        currentBlock,
        nextBlock,
        dropPosition: currentBlock.adjustInitialPosition(layout.initialPosition),
        speed: Actions.TickSpeed.Normal,
        runState: GameRunState('Stop'),
        score: 0,
        clearedRows: 0,
        level: 1,
      },
    };
  }

  /** @category mapping */
  getMovePosition(move: Actions.MoveDirection) {
    return Actions.getMoveDirectionUnit(move).sum(this.player.dropPosition);
  }

  /** @category mapping */
  getMoveAction(direction: Actions.MoveDirection): Actions.PlayerMoveResult {
    const moveTo = this.getMovePosition(direction);
    return {
      direction,
      move: {
        to: moveTo,
        from: this.currentPosition,
      },
      blockPosition: {
        from: this.currentShapePoints,
        to: this.player.currentBlock.getGridPointsAt(moveTo),
      },
    };
  }

  /** @category mapping */
  getActionExecution({
    blockPosition,
    move,
  }: Actions.PlayerMoveResult): Actions.PlayerActionExecution {
    const moveToBounds = this.player.currentBlock.getBoundsFor(move.to);
    const execute: Actions.PlayerActionExecution = {
      moveTo: Option.some(move.to),
      clearRows: [],
      gameOver: move.to.row < 0,
      mergeBlock: move.to.row >= this.layout.config.rows,
    };

    if (execute.gameOver) return execute;
    // Check invalid left/right move in grid
    if (
      moveToBounds.min.lessThan.column(this.gridBounds.min) ||
      moveToBounds.max.greatThanOrEquals.column(this.gridBounds.max)
    ) {
      debugObjectLog('INVALID_LEFT_RIGHT_MOVE', {
        currentPos: {
          row: this.player.dropPosition.row,
          column: this.player.dropPosition.column,
        },
        currentBounds: {
          min: {
            row: moveToBounds.min.row,
            column: moveToBounds.min.column,
          },
          max: {
            row: moveToBounds.max.row,
            column: moveToBounds.max.column,
          },
        },
      });
      execute.moveTo = Option.none();
      return execute;
    }

    // get next position cells that are merged
    const collidedCells = RA.filterMap(blockPosition.to, (x) =>
      this.findCellByPoint(x).pipe(
        Option.flatMap(Option.liftPredicate((x) => !x.isMerged)),
      ),
    );

    if (blockPosition.to.length > collidedCells.length) {
      debugObjectLog('Move to bounds compared to (Grid)', {
        min: {
          less: {
            column: moveToBounds.min.lessThan.column(this.gridBounds.min),
            row: moveToBounds.min.lessThan.row(this.gridBounds.min),
            that: moveToBounds.min.lessThan.that(this.gridBounds.min),
          },
          greater: {
            column: moveToBounds.min.greatThan.column(this.gridBounds.min),
            row: moveToBounds.min.greatThan.row(this.gridBounds.min),
            that: moveToBounds.min.greatThan.that(this.gridBounds.min),
          },
        },
        max: {
          less: {
            column: moveToBounds.max.lessThan.column(this.gridBounds.max),
            row: moveToBounds.max.lessThan.row(this.gridBounds.max),
            that: moveToBounds.max.lessThan.that(this.gridBounds.max),
          },
          greater: {
            column: moveToBounds.max.greatThan.column(this.gridBounds.max),
            row: moveToBounds.max.greatThan.row(this.gridBounds.max),
            that: moveToBounds.max.greatThan.that(this.gridBounds.max),
          },
        },
        moveToBounds: {
          min: { row: moveToBounds.min.row, column: moveToBounds.min.column },
          max: { row: moveToBounds.max.row, column: moveToBounds.max.column },
        },
        grid: {
          min: { row: this.gridBounds.min.row, column: this.gridBounds.min.column },
          max: { row: this.gridBounds.max.row, column: this.gridBounds.max.column },
        },
        // greatThanGrid: {
        //   column: moveToBounds.min.lessThan.column(this.gridBounds.min),
        //   row: moveToBounds.min.lessThan.row(this.gridBounds.min),
        //   that: moveToBounds.min.lessThan.that(this.gridBounds.min),
        // },
        // min: {
        //   row: this.gridBounds.min.greatThan.row(moveToBounds.min),
        //   col: this.gridBounds.min.greatThan.column(moveToBounds.min),
        // },

        // moveToBounds,
        // gridBounds: this.gridBounds,
        // blockBounds: moveToBounds,
        // layout: this.layout.config,
      });

      if (this.gridBounds.max.greatThan.column(moveToBounds.max)) {
        execute.mergeBlock = true;
        execute.moveTo = Option.some(move.from);
        return execute;
      }

      // debugObjectLog('INVALID_MOVE', {
      //   compare: {
      //     max: bounds.max.greatThan.that(this.gridBounds.max),
      //     min: bounds.min.greatThan.that(this.gridBounds.min),
      //   },
      //   gridBounds: this.gridBounds,
      //   layout: this.layout.config,
      //   moveTo: move.to,
      //   bounds,
      //   moveFrom: move.from,
      // });

      execute.moveTo = Option.none();
      return execute;
    }

    // for (const nextPoint of collidedCells) {
    //   const nextPointIsDown = nextPoint.point.row > move.to.row;
    //   execute.mergeBlock = nextPointIsDown && nextPoint.cell.isMerged;
    // }
    return execute;
  }

  /** @category accessors */
  findCellByPoint(point: GridPosition) {
    return HashMap.get(this.board.cellsMap, point);
  }

  /**
   * @category mutations
   * @description Update board cells with current colors (no updates the state)
   **/
  draw() {
    for (const point of this.currentShapePoints) {
      this.findCellByPoint(point).pipe(
        Option.map((cell) => cell.setColorFor(this.player.currentBlock)),
      );
    }
  }

  /**
   * @category mutations
   * @description execute the action to run after game action (updates state)
   **/
  updateBoard(position: GridPosition, merge: boolean) {
    for (const point of this.currentShapePoints) {
      this.findCellByPoint(point).pipe(Option.map((cell) => cell.clear()));
    }

    for (const point of this.player.currentBlock.getGridPointsAt(position)) {
      this.findCellByPoint(point).pipe(
        Option.map((cell) => {
          cell.setColorFor(this.player.currentBlock);
          if (merge) cell.mergeCell();
        }),
      );
    }

    if (merge) {
      this.swapNextBlock();
      return;
    }
    this.mutatePlayer({
      dropPosition: position,
    });
  }

  protected mutatePlayer(playerState: Partial<BaseGridModel['player']>) {
    this.state = {
      player: {
        ...this.state.player,
        ...playerState,
      },
      board: {
        ...this.state.board,
      },
    };
  }

  getPointBoundsDistance(point: GridPosition): Actions.GridPositionBounds {
    return {
      right: this.board.layout.config.columns - point.column,
      left: point.column,
      up: point.row,
      down: this.board.layout.config.rows - point.row,
    };
  }

  swapNextBlock() {
    this.state.player.dropPosition = this.state.player.currentBlock.adjustInitialPosition(
      this.board.layout.initialPosition,
    );
    this.state.player.currentBlock = this.state.player.nextBlock;
    this.state.player.nextBlock = GridUtils.getRandomShape();
  }
}
