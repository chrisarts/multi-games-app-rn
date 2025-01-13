import * as Effect from 'effect/Effect';
import * as Queue from 'effect/Queue';
import * as GameAction from '../Domain/GameAction.domain';
import type * as Game from '../Domain/GameState.domain';
import type * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';
import { GameRepoContext } from '../Services/GameRepo.service';
import { PlayerContext } from '../Services/Player.service';
import { TetrisLayer, TetrisRuntime } from '../Services/Runtime.layers';
import { debugObjectLog } from '../utils/log.utils';

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
    Effect.andThen((action) =>
      GameAction.GameAction.$match(action, {
        move: (x) => onMoveAction(x.to),
        rotate: (x) => onMoveAction(x.to),
        statusChange: (x) => onStatusAction(x.state),
      }),
    ),
    Effect.forever,
    Effect.forkDaemon,
  );

  // const isRunning = gameRepo
  //   .selector((x) => x.gameStatus)
  //   .pipe(Effect.map((x) => x !== Game.GameRunState('GameOver')));

  // while (yield* isRunning) {
  //   // yield* Effect.log('Running...');
  //   const { speed, status } = yield* gameRepo.selector((x) => ({
  //     status: x.gameStatus,
  //     speed: x.speed,
  //   }));

  //   if (status === Game.GameRunState('InProgress')) {
  //     yield* playerActions.offer(
  //       GameAction.GameAction.move({ to: GameAction.makeMove.down() }),
  //     );
  //   }

  //   yield* Effect.sleep(Duration.millis(speed));
  // }

  Effect.addFinalizer(() => Effect.log('Finalized Game Service'));
  return {
    updatesDequeue,
  };

  function onMoveAction(moveTo: Position.Position) {
    return Effect.gen(function* () {
      const {
        nextDraw,
        nextPosition,
        merge,
        gameOver,
        tetromino,
        insideGrid,
        currentPos,
      } = yield* gameRepo.getMoveUnitState(moveTo);

      if (gameOver) {
        debugObjectLog('GAME_OVER', nextDraw.bounds);
        return;
      }

      if (merge) {
        debugObjectLog('MERGE: ', nextDraw.bounds);
      }

      if (!insideGrid && merge) {
        debugObjectLog('INVALID_NEXT_POSITION', {
          draw: nextDraw.bounds,
          currentPos: currentPos,
          nextPosition,
        });
        
      }

      const { positions } = Tetromino.mapWithPosition(tetromino, currentPos);

      console.log('MERGE: ', merge);

      if (merge) {
      }
      yield* gameRepo.unsafeUpdateBoard({
        tetromino,
        updatedPosition: merge ? currentPos : nextPosition,
        fromPositions: positions,
        toPositions: nextDraw.positions,
        merge,
      });
    });
  }

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
