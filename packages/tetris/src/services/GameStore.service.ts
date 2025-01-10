import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as HashMap from 'effect/HashMap';
import type * as HashSet from 'effect/HashSet';
import * as Layer from 'effect/Layer';
import { CollisionResult, type MoveDirection } from '../models/Action.model';
import { GameState, TickSpeed } from '../models/Board.model';
import { BoardGrid } from '../models/BoardGrid.model';
import { GridPosition } from '../models/GridPosition.model';
import { BOARD_CONFIG } from '../utils/board.utils';
import { createStoreContext } from '../utils/common.utils';
import type { GridLayout } from '../utils/grid.utils';

const makeCtx = Effect.gen(function* () {
  const gameBoard = yield* Effect.sync(
    () =>
      new BoardGrid({
        height: BOARD_CONFIG.HEIGHT,
        width: BOARD_CONFIG.WIDTH,
      }),
  );
  const store = yield* createStoreContext(createGameStoreShape(gameBoard));

  return {
    controls: {
      runMoveTo,
      runRotate,
      changeRunState,
      changeGameSpeed,
      getCellAt: (point: GridPosition) => gameBoard.pointToCell(point),
      refreshBoard,
    },
    store: {
      subscribe: store.subscribe,
      selectState: store.selector,
    } as const,
  };

  function runMoveTo(direction: MoveDirection) {
    if (gameBoard.collided) return;

    const collision = gameBoard.checkMoveCollision(direction);
    CollisionResult.$match({
      CLEAR: ({ toPoint }) => {
        gameBoard.updateBoard(toPoint, false);
      },
      LIMIT_REACHED: ({ gameOver, merge }) => {
        console.log('LIMIT: ', { gameOver, merge });
        if (merge) {
          gameBoard.updateBoard(gameBoard.currentBlock.currentPosition, true);
        }
      },
      MERGED_SIBLING: ({ sibling, gameOver }) => {
        if (!gameOver)
          gameBoard.updateBoard(gameBoard.currentBlock.currentPosition, true);
      },
    })(collision);
    if (CollisionResult.$is('MERGED_SIBLING')(collision) && collision.gameOver) {
      return changeRunState(GameState.STOP);
    }

    store.setState((prev) => ({ ...prev }));
  }

  function runRotate() {
    const currentPosition = {
      x: gameBoard.currentBlock.currentPosition.x,
      y: gameBoard.currentBlock.currentPosition.y,
    };
    const rotatedShape = gameBoard.currentBlock.getState().nextShape;

    const posX = currentPosition.x;
    let offset = 1;

    while (
      gameBoard.pointHasCollision(GridPosition.create(currentPosition)) === undefined
    ) {
      currentPosition.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      console.log('POS: ', posX, offset);

      if (offset > rotatedShape[0].length) {
        currentPosition.x = posX;
        break;
      }
    }
    gameBoard.currentBlock.toPoints().forEach((x) => {
      const cell = gameBoard.pointToCell(x);
      if (cell._tag === 'Some') {
        cell.value.clear();
      }
    });
    gameBoard.currentBlock.toNextShape();
    gameBoard.currentBlock.updatePosition(GridPosition.create(currentPosition), false);
    store.setState((prev) => ({ ...prev }));
  }

  function refreshBoard() {
    gameBoard.draw();
    store.setState((x) => x);
  }

  function changeRunState(nextState: GameState) {
    if (nextState === store.getState().game.status) {
      return;
    }
    store.setState((prev) => ({
      ...prev,
      game: {
        speed: prev.game.speed,
        status: nextState,
      },
    }));
  }

  function changeGameSpeed(speed: TickSpeed) {
    if (speed === store.getState().game.speed) {
      return;
    }
    store.setState((prev) => ({
      ...prev,
      game: {
        speed,
        status: prev.game.status,
      },
    }));
  }
});

export interface TetrisStoreContext extends Effect.Effect.Success<typeof makeCtx> {}
export const TetrisStoreContext =
  Context.GenericTag<TetrisStoreContext>('TetrisStoreContext');
export const TetrisStoreContextLive = Layer.effect(TetrisStoreContext, makeCtx);

interface TetrisGameStore {
  board: {
    points: HashSet.HashSet<GridPosition>;
    layout: GridLayout;
  };
  game: {
    status: GameState;
    speed: TickSpeed;
  };
  player: {
    score: number;
    clearedRows: number;
    level: number;
  };
}

const createGameStoreShape = (gameBoard: BoardGrid): TetrisGameStore => ({
  game: {
    speed: TickSpeed.Normal,
    status: GameState.STOP,
  },
  player: {
    clearedRows: 0,
    level: 0,
    score: 0,
  },
  board: {
    points: HashMap.keySet(gameBoard.grid),
    layout: gameBoard.layout,
  },
});
