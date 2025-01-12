import { Queue } from 'effect';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as PubSub from 'effect/PubSub';
import * as Stream from 'effect/Stream';
import * as GameState from '../Domain/Game.domain';
import type * as GameAction from '../Domain/GameAction.domain';
import { GameStore } from '../Store/Game.store';
import { PlayerContext } from './Player.service';
import { TetrisLayer } from './Runtime.layers';

export const make = Effect.gen(function* () {
  const hub = yield* PubSub.unbounded<GameAction.GameAction>();
  const player = yield* PlayerContext;

  yield* Stream.async<GameState.GameState>((emit) => {
    const subscriber = GameStore.store.subscribe((state) =>
      Effect.runSync(Effect.sync(() => emit.single(state))),
    );

    return Effect.sync(() => subscriber()).pipe(
      Effect.tap((r) => Effect.log(`Unsubscribe from store success: ${r}`)),
    );
  }).pipe(
    Stream.runForEach((state) => Effect.log('GAME_STATE_CHANGE: ', state.gameStatus)),
    Effect.fork,
  );

  yield* Queue.take(player.playerActions).pipe(
    Effect.tap((published) => Effect.log('RUN_ACTION: ', published._tag)),
    Effect.forever,
  );

  yield* Effect.sleep('3 seconds').pipe(
    Effect.tap(() =>
      Effect.sync(() => GameStore.setRunState(GameState.GameRunState('InProgress'))),
    ),
  );

  return {
    onAction,
    subscribe,
  };

  function onAction(action: GameAction.GameAction) {}

  function subscribe() {
    return PubSub.subscribe(hub).pipe(
      Effect.andThen((_) =>
        Effect.addFinalizer(() =>
          Effect.log('Unimplemented: Must reset the game tho'),
        ).pipe(Effect.map(() => _)),
      ),
      Effect.tap(() => Effect.log('Subscribing to game...')),
      Effect.map(Stream.fromQueue),
    );
  }

  // TODO: Set state from this fn
  // function moveTo(move: Game.MoveDirection) {
  //   const moveAction = gameBoard.getMoveAction(move);
  //   const run = gameBoard.getActionExecution(moveAction);

  //   console.log('RUN: ', run);
  // }
}).pipe(Effect.tap(() => Effect.log('Provided Game service ctx')));

export interface GameContext extends Effect.Effect.Success<typeof make> {}
export const GameContext = Context.GenericTag<GameContext>('GameContext');
export const GameContextLive = Layer.effect(GameContext, make).pipe(
  Layer.provide(TetrisLayer),
);
