import { Deferred, pipe } from 'effect';
import * as Context from 'effect/Context';
import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import * as PubSub from 'effect/PubSub';
import * as Ref from 'effect/Ref';
import * as Stream from 'effect/Stream';
import { PlayerAction } from '../../models/Action.model';
import { MoveDirection } from '../../models/Block.model';
import { GameState } from '../../models/Board.model';
import { GameModel } from '../../models/Game.model';
import { GameStateCtx, GameStateCtxLive } from './GameState.service';

const make = Effect.gen(function* () {
  const { gameRef, onMove, onSetState, onSetSpeed } = yield* GameStateCtx;
  const hub = yield* PubSub.unbounded<PlayerAction>();

  const runGame = Effect.gen(function* () {
    const game = yield* gameRef;
    const gameState = game.state;
    yield* Effect.log('RUN_GAME', gameState.getState().status);
    const latch = yield* Deferred.make<boolean>();

    yield* subscribe().pipe(
      Effect.andThen((subscriber) =>
        subscriber.pipe(
          Stream.tap((action) => {
            return PlayerAction.$match({
              move: ({ direction }) => onMove(direction),
              rotate: ({ direction }) => onMove(direction),
              runState: ({ status }) => onSetState(status),
              setSpeed: ({ speed }) => onSetSpeed(speed),
            })(action);
          }),
          Stream.runDrain,
          Effect.fork,
        ),
      ),
    );

    game.setState(GameState.PLAYING);
    yield* Effect.log('RUN_GAME_2', gameState.getState().status);

    yield* publishAction(GameModel.playerActions.move(MoveDirection.DOWN)).pipe(
      Effect.delay(Duration.millis(gameState.getState().speed)),
      Effect.repeat({
        while: () =>
          Effect.succeed(gameState.getState().status === GameState.PLAYING).pipe(
            Effect.tap((x) => Effect.logDebug('CONTINUE?: ', x)),
          ),
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

  function onGameTick() {
    return gameRef.pipe(
      Effect.map((x) => x.state.getState()),
      Effect.andThen((state) =>
        PubSub.publish(hub, GameModel.playerActions.move(MoveDirection.DOWN)).pipe(
          Effect.delay(Duration.millis(state.speed)),
        ),
      ),
    );
  }

  function publishAction(action: PlayerAction) {
    return PubSub.publish(hub, action);
  }

  function subscribe() {
    return PubSub.subscribe(hub).pipe(
      Effect.andThen((_) =>
        // Effect.addFinalizer(() => _.shutdown)
        Effect.addFinalizer(() => _.shutdown).pipe(
          Effect.map(() => _),
          Effect.tap((final) => Effect.log('Active PubSub?: ', final.isActive())),
        ),
      ),
      Effect.tap(() => Effect.log('Subscribe to board state')),
      Effect.map(Stream.fromQueue),
    );
  }

  function subscribeTo<_Tag extends PlayerAction['_tag']>(action: _Tag) {
    return subscribe().pipe(
      Effect.map(
        Stream.filterMap((event) =>
          Option.liftPredicate(event, PlayerAction.$is(action)),
        ),
      ),
    );
  }
}).pipe(Effect.tap(() => Effect.log('PROVIDE_TETRIS_SERVICE_CTX')));

export interface TetrisServiceCtx extends Effect.Effect.Success<typeof make> {}
export const TetrisServiceCtx = Context.GenericTag<TetrisServiceCtx>('TetrisServiceCtx');
export const TetrisServiceCtxLive = Layer.effect(TetrisServiceCtx, make).pipe(
  Layer.provide(GameStateCtxLive),
);
