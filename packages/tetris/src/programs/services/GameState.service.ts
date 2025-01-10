import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Ref from 'effect/Ref';
import type { MoveDirection } from '../../models/Block.model';
import { GameState, type TickSpeed } from '../../models/Board.model';
import { GameModel } from '../../models/Game.model';

export const make = Effect.gen(function* () {
  const gameRef = yield* Effect.cached(Effect.sync(() => new GameModel()));

  const isRunning = gameRef.pipe(
    Effect.map((state) => state.state.getState().status === GameState.PLAYING),
  );

  const onMove = (direction: MoveDirection) =>
    gameRef.pipe(Effect.tap((game) => Effect.sync(() => game.moveBlock(direction))));

  const onSetState = (status: GameState) =>
    gameRef.pipe(
      Effect.tap((game) => Effect.sync(() => game.setState(status))),
      Effect.tap(() => Effect.log('UPDATE_STATE', status)),
    );

  const onSetSpeed = (speed: TickSpeed) =>
    gameRef.pipe(
      Effect.tap((game) =>
        Effect.sync(() =>
          game.state.setState((prev) => {
            prev.speed = speed;
            return prev;
          }),
        ),
      ),
    );

  return {
    gameRef,
    isRunning,
    onMove,
    onSetState,
    onSetSpeed,
  };
}).pipe(Effect.tap(() => Effect.log('Provided GameState service ctx')));

export interface GameStateCtx extends Effect.Effect.Success<typeof make> {}
export const GameStateCtx = Context.GenericTag<GameStateCtx>('GameStateCtx');
export const GameStateCtxLive = Layer.effect(GameStateCtx, make);
