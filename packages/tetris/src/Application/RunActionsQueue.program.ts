import { Iterable } from 'effect';
import * as Effect from 'effect/Effect';
import * as GameAction from '../Domain/GameAction.domain';
import { GameStore } from '../Store/Game.store';
import { MoveTetrominoProgram } from './MoveTetromino.program';

export const RunActionsQueue = (actions: Iterable<GameAction.GameAction>) => {
  return Effect.all(
    Iterable.map(actions, (action) =>
      GameAction.GameAction.$match(action, {
        move: (x) =>
          MoveTetrominoProgram(x.to).pipe(
            Effect.tap((x) => Effect.log('FINISH MOVE', x)),
          ),
        statusChange: (x) =>
          Effect.sync(() =>
            GameStore.setState((prev) => {
              prev.game.status = x.state;
              return prev;
            }),
          ),
      }),
    ),
    {
      concurrency: 'inherit',
      discard: true,
    },
  );
};
