import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import type * as Actions from '../models/Action.model';
import { TetrisStoreContext, TetrisStoreContextLive } from './GameStore.service';

export const make = Effect.gen(function* () {
  const { gameBoard } = yield* TetrisStoreContext;

  return {
    moveTo,
  };

  // TODO: Set state from this fn
  function moveTo(move: Actions.MoveDirection) {
    const moveAction = gameBoard.getMoveAction(move);
    const run = gameBoard.getActionExecution(moveAction);

    console.log('RUN: ', run);
  }
}).pipe(Effect.tap(() => Effect.log('Provided player service ctx')));

export interface PlayerContext extends Effect.Effect.Success<typeof make> {}
export const PlayerContext = Context.GenericTag<PlayerContext>('PlayerContext');
export const PlayerContextLive = Layer.effect(PlayerContext, make).pipe(
  Layer.provide(TetrisStoreContextLive),
);
