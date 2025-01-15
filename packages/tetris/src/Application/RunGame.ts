import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';
import * as Queue from 'effect/Queue';
import * as GameAction from '../Domain/GameAction.domain';
import type * as Game from '../Domain/GameState.domain';
import { GameRepoContext } from '../Services/GameRepo.service';
import { PlayerContext } from '../Services/Player.service';
import { MoveTetrominoProgram } from './MoveTetromino.program';

export const runForkedTetris = Effect.gen(function* () {
  const gameRepo = yield* GameRepoContext;
  const { playerActions, publishAction } = yield* PlayerContext;

  const updatesDequeue = yield* Queue.take(playerActions).pipe(
    Effect.map((action) => {
      if (action._tag === 'move') {
        return MoveTetrominoProgram(action.to);
      }
      if (action._tag === 'statusChange') {
        return onStatusAction(action.state);
      }
      return Effect.void;
    }),
    Effect.flatten,
    Effect.forever,
    Effect.fork,
  );

  yield* Effect.addFinalizer(() => Effect.log('Finalized Game Service'));

  yield* Effect.gen(function* () {
    const stop = yield* gameRepo.selector((x) => x.game.status === 'Stop');
    const speed = yield* gameRepo.selector((x) => x.game.speed);

    yield* Effect.sleep(Duration.millis(speed));
    if (!stop) {
      yield* publishAction(
        GameAction.GameAction.move({ to: GameAction.makeMove.down() }),
      );
    }
  }).pipe(
    Effect.repeat({
      until: () => gameRepo.selector((x) => x.game.status === 'GameOver'),
    }),
  );

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
