import * as Context from 'effect/Context';
import * as Deferred from 'effect/Deferred';
import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';
import * as Equal from 'effect/Equal';
import * as Layer from 'effect/Layer';
import * as PubSub from 'effect/PubSub';
import * as Stream from 'effect/Stream';
import {
  GameRunState,
  MoveDirection,
  PlayerAction,
  TickSpeed,
} from '../models/Action.model';
import { GameStateCtx, GameStateCtxLive } from './GameState.service';

const make = Effect.gen(function* () {
  const { gameRef, onMove, onSetState, onSetSpeed, onRotate } = yield* GameStateCtx;
  const hub = yield* PubSub.unbounded<PlayerAction>();

  const subscribeToGame = subscribe().pipe(
    Effect.andThen((subscriber) =>
      subscriber.pipe(
        Stream.tap((action) => {
          return PlayerAction.$match({
            move: ({ direction }) => onMove(direction),
            rotate: () => onRotate(),
            runState: ({ status }) => onSetState(status),
            setSpeed: ({ speed }) => onSetSpeed(TickSpeed[speed]),
          })(action);
        }),
        Stream.runDrain,
        Effect.fork,
      ),
    ),
  );

  const runGame = Effect.gen(function* () {
    const game = yield* gameRef;
    const gameState = game.state;
    yield* Effect.log('RUN_GAME', gameState.getState().status);
    const latch = yield* Deferred.make<boolean>();

    yield* subscribeToGame;

    yield* Effect.log('RUN_GAME_2', gameState.getState().status);

    yield* Effect.zipRight(
      onSetState(GameRunState('Play')),
      publishAction(PlayerAction.move({ direction: MoveDirection('down') })),
    ).pipe(
      Effect.delay(Duration.millis(gameState.getState().speed)),
      Effect.repeat({
        while: () =>
          Effect.succeed(
            Equal.equals(gameState.getState().status, GameRunState('Play')),
          ).pipe(Effect.tap((x) => Effect.logDebug('CONTINUE?: ', x))),
      }),
      Effect.fork,
    );
    yield* Deferred.await(latch);
  }).pipe(Effect.scoped);

  // Effect.zip(gameActions, gameTicks).pipe(Effect.forkDaemon);

  return {
    publishAction,
    subscribe,
    runGame,
  };

  function publishAction(action: PlayerAction) {
    return PubSub.publish(hub, action);
  }

  function subscribe() {
    return PubSub.subscribe(hub).pipe(
      Effect.andThen((_) =>
        Effect.addFinalizer(() => _.shutdown).pipe(Effect.map(() => _)),
      ),
      Effect.tap(() => Effect.log('Subscribe to board state')),
      Effect.map(Stream.fromQueue),
    );
  }
}).pipe(Effect.tap(() => Effect.log('PROVIDE_TETRIS_SERVICE_CTX')));

export interface TetrisServiceCtx extends Effect.Effect.Success<typeof make> {}
export const TetrisServiceCtx = Context.GenericTag<TetrisServiceCtx>('TetrisServiceCtx');
export const TetrisServiceCtxLive = Layer.effect(TetrisServiceCtx, make).pipe(
  Layer.provide(GameStateCtxLive),
);
