import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Queue from 'effect/Queue';
import type * as GameAction from '../Domain/GameAction.domain';

export const make = Effect.gen(function* () {
  const playerActions = yield* Queue.unbounded<GameAction.GameAction>();

  const publishAction = (action: GameAction.GameAction) =>
    Queue.unsafeOffer(playerActions, action);

  return {
    playerActions,
    publishAction,
  };

  // TODO: Set state from this fn
  // function moveTo(move: Game.MoveDirection) {
  //   const moveAction = gameBoard.getMoveAction(move);
  //   const run = gameBoard.getActionExecution(moveAction);

  //   console.log('RUN: ', run);
  // }
}).pipe(Effect.tap(() => Effect.log('Provided player service ctx')));

export interface PlayerContext extends Effect.Effect.Success<typeof make> {}
export const PlayerContext = Context.GenericTag<PlayerContext>('PlayerContext');
export const PlayerContextLive = Layer.scoped(PlayerContext, make);
