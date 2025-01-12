import { Option } from 'effect';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import { GameRunState } from '../../Domain/Game.domain';
import { createStoreContext } from '../../utils/common.utils';
import type { MoveDirection, PlayerActionExecution } from '../models/Action.model';
import { BoardGrid } from '../models/BoardGrid.model';
import type { GridPosition } from '../models/GridPosition.model';

const makeCtx = Effect.gen(function* () {
  const gameBoard = yield* Effect.sync(() => new BoardGrid());
  const store = yield* createStoreContext(gameBoard.state);

  return {
    gameBoard,
    controls: {
      runMoveTo,
      runRotate,
      setRunState,
      getCellAt: (point: GridPosition) => gameBoard.findCellByPoint(point),
      refreshBoard,
    },
    store: {
      subscribe: store.subscribe,
      selectState: <Value>(cb: (state: BoardGrid['state']) => Value): Value =>
        store.selector(() => cb(gameBoard.state)),
    } as const,
  };

  function setRunState(runState: GameRunState) {
    gameBoard.state.player.runState = runState;
    store.setState(() => gameBoard.state);
  }

  function runMoveTo(direction: MoveDirection) {
    console.log('MOVE: ', direction);
    const moveAction = gameBoard.getMoveAction(direction);
    const run = gameBoard.getActionExecution(moveAction);
    runAction(run);
    // store.setState(() => gameBoard.moveBlock(direction));
  }

  function runAction(action: PlayerActionExecution) {
    const data = {
      ...action,
      moveTo: action.moveTo.pipe(Option.getOrNull),
    };
    if (action.gameOver) {
      console.warn('GAME_OVER: ', data);
      gameBoard.state.player.runState = GameRunState('Stop');
      store.setState((x) => x);
    }
    if (!data.moveTo) {
      console.log('BLOCK_MOVE', data);
      store.setState(() => gameBoard.state);
      return;
    }

    if (action.mergeBlock) console.log('MMMEEEEEERGEEEE');
    gameBoard.updateBoard(data.moveTo, action.mergeBlock);
    store.setState(() => gameBoard.state);
  }

  function runRotate() {
    const rotatedShape = gameBoard.state.player.currentBlock.rotate();
    gameBoard.draw();
    gameBoard.state.player.currentBlock
      .getGridPointsAt(gameBoard.state.player.dropPosition)
      .forEach((x) => {
        const cell = gameBoard.findCellByPoint(x);
        if (cell._tag === 'Some') {
          cell.value.clear();
        }
      });
  }

  function refreshBoard() {
    gameBoard.draw();
    store.setState(() => gameBoard.state);
  }
});

export interface TetrisStoreContext extends Effect.Effect.Success<typeof makeCtx> {}
export const TetrisStoreContext =
  Context.GenericTag<TetrisStoreContext>('TetrisStoreContext');
export const TetrisStoreContextLive = Layer.effect(TetrisStoreContext, makeCtx);
