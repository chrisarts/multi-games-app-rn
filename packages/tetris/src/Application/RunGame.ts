import * as Effect from 'effect/Effect';
import * as Queue from 'effect/Queue';
import type * as GameAction from '../Domain/GameAction.domain';
import type * as Game from '../Domain/GameState.domain';
import { GameRepoContext } from '../Services/GameRepo.service';
import { PlayerContext } from '../Services/Player.service';
import { TetrisLayer, TetrisRuntime } from '../Services/Runtime.layers';
import { MoveTetrominoProgram } from './MoveTetromino.program';

export const playerContextLive = Effect.gen(function* () {
  const { playerActions, publishAction } = yield* PlayerContext;

  return {
    playerActions,
    publishAction,
  };
}).pipe(Effect.provide(TetrisLayer));

export const publishPlayerAction = (action: GameAction.GameAction) =>
  TetrisRuntime.runPromise(
    Effect.andThen(PlayerContext, (ctx) => Queue.offer(ctx.playerActions, action)),
  );

export const runForkedTetris = Effect.gen(function* () {
  const gameRepo = yield* GameRepoContext;
  const { playerActions } = yield* PlayerContext;

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

  // TODO: Set state from this fn
  // function moveTo(move: Game.MoveDirection) {
  //   const moveAction = gameBoard.getMoveAction(move);
  //   const run = gameBoard.getActionExecution(moveAction);

  //   console.log('RUN: ', run);
  // }
}).pipe(Effect.scoped);
