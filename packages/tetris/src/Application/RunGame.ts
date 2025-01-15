import * as Effect from 'effect/Effect';
import * as Queue from 'effect/Queue';
import type * as Game from '../Domain/GameState.domain';
import { GameRepoContext } from '../Services/GameRepo.service';
import { PlayerContext } from '../Services/Player.service';
import { MoveTetrominoProgram } from './MoveTetromino.program';

export const runForkedTetris = Effect.gen(function* () {
  const gameRepo = yield* GameRepoContext;
  const { playerActions } = yield* PlayerContext;

  const updatesDequeue = yield* Queue.take(playerActions).pipe(
    Effect.map((action) => {
      if (action._tag === 'move') {
        return MoveTetrominoProgram(action.to).pipe(
          Effect.tap((result) => {
            if (result.run !== 'MoveTetromino') {
              console.group('MoveAction', result.run);
              console.log(
                JSON.stringify({
                  collisions: result.debugData.collisions,
                  pos: result.debugData.currentPosition,
                  nextPos: result.debugData.nextPosition,
                }),
              );
              console.groupEnd();
            }

            return Effect.void;
          }),
        );
      }
      if (action._tag === 'statusChange') {
        return onStatusAction(action.state);
      }
      return Effect.void;
    }),
    Effect.flatten,
    Effect.forever,
  );

  yield* Effect.addFinalizer(() => Effect.log('Finalized Game Service'));

  return {
    updatesDequeue,
  };

  function onStatusAction(state: Game.GameRunState) {
    console.log('PUBLISHED_ACTION: ', state);
    switch (state) {
      case 'InProgress':
        return gameRepo.actions.startGame;
      case 'GameOver':
        return gameRepo.actions.stopGame;
      case 'Stop':
        return gameRepo.actions.stopGame;
    }
  }
}).pipe(Effect.scoped);
