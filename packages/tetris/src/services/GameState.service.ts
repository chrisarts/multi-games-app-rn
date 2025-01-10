import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Equal from 'effect/Equal';
import * as Layer from 'effect/Layer';
import * as Ref from 'effect/Ref';
import { GameRunState, type MoveDirection } from '../models/Action.model';
import { GameModel } from '../models/Game.model';

export const make = Effect.gen(function* () {
  const gameRef = yield* Ref.make(new GameModel());

  const isRunning = gameRef.pipe(
    Effect.map((state) =>
      Equal.equals(state.state.getState().status, GameRunState('Play')),
    ),
  );

  return {
    gameRef,
    isRunning,
    onMove,
    onSetState,
    onSetSpeed,
    onRotate,
  };

  function onMove(direction: MoveDirection) {
    return Effect.tap(gameRef, (game) => Effect.sync(() => game.moveBlock(direction)));
  }

  function onRotate() {
    return Effect.tap(gameRef, (game) => Effect.sync(() => game.rotateBlock()));
  }

  function onSetState(status: GameRunState) {
    return gameRef.pipe(
      Effect.tap((game) => Effect.sync(() => game.setRunStatus(status))),
      Effect.as<void>(void 0),
    );
  }

  function onSetSpeed(speed: number) {
    return Effect.tap(gameRef, (game) =>
      Effect.sync(() =>
        game.state.setState((prev) => {
          prev.speed = speed;
          return prev;
        }),
      ),
    );
  }
}).pipe(Effect.tap(() => Effect.log('Provided GameState service ctx')));

export interface GameStateCtx extends Effect.Effect.Success<typeof make> {}
export const GameStateCtx = Context.GenericTag<GameStateCtx>('GameStateCtx');
export const GameStateCtxLive = Layer.effect(GameStateCtx, make);
