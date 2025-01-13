import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';
import * as HashMap from 'effect/HashMap';
import * as Queue from 'effect/Queue';
import * as Stream from 'effect/Stream';
import * as Game from '../Domain/Game.domain';
import * as GameAction from '../Domain/GameAction.domain';
import * as Position from '../Domain/Position.domain';
import { GameRepoContext } from '../Services/GameRepo.service';
import { GridRepoContext } from '../Services/GridStore.service';
import { PlayerContext } from '../Services/Player.service';
import { TetrisLayer, TetrisRuntime } from '../Services/Runtime.layers';
import { listenForkedStreamChanges } from '../utils/effect.utils';

export const playerContextLive = Effect.gen(function* () {
  const { playerActions, publishAction } = yield* PlayerContext;

  return {
    playerActions,
    publishAction,
  };
}).pipe(Effect.provide(TetrisLayer));

export const publishPlayerAction = (action: GameAction.GameAction) =>
  Effect.gen(function* () {
    const { playerActions } = yield* PlayerContext;

    return yield* Queue.offer(playerActions, action);
  }).pipe(TetrisRuntime.runPromise);

export const runForkedTetris = Effect.gen(function* () {
  const gameRepo = yield* GameRepoContext;
  const gridRepo = yield* GridRepoContext;
  const { playerActions } = yield* PlayerContext;

  yield* gameRepo.addListener.pipe(Stream.unwrap, (stream) =>
    listenForkedStreamChanges(stream, (state) => {
      return Effect.void;
      // Effect.log('LISTEN_CHANGES: ', state.gameStatus);
    }),
  );

  yield* gridRepo.addListener.pipe(Stream.unwrap, (stream) =>
    listenForkedStreamChanges(
      stream,
      (state) => Effect.void,
      // Effect.log('Grid state change: ', HashMap.size(state.cellsMap)),
    ),
  );

  const updatesDequeue = yield* Queue.take(playerActions).pipe(
    // Effect.tap((action) => Effect.log('Received action', action)),
    Effect.andThen((action) => {
      if (GameAction.GameAction.$is('move')(action)) {
        console.log('RECEIVED_ACTION: ', action.to);
      }
      return GameAction.GameAction.$match(action, {
        move: (x) => onMoveAction(x.to),
        rotate: (x) =>
          onMoveAction(x.to).pipe(Effect.tap(() => Effect.log('MOVE_TO', x))),
        statusChange: (x) => onStatusAction(x.state),
      });
    }),
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
      console.log('MOVE_TO: ', moveTo);
      const currentPos = yield* gameRepo.selector((x) => x.dropPosition);
      const tetromino = yield* gameRepo.selector((x) => x.currentTetromino);
      const nextPosition = Position.sum(currentPos, moveTo);

      for (const drawPos of tetromino.drawPositions) {
        const nextDrawPos = Position.sum(drawPos, nextPosition);
        yield* gridRepo.actions.mapCellState(nextDrawPos, (cell) => {
          cell.state = {
            color: tetromino.color,
            merged: false,
          };
          return cell;
        });
      }
      yield* gameRepo.actions.updateDropPosition(nextPosition);
    });
  }

  function onStatusAction(state: Game.GameRunState) {
    console.log('PUBLISHED_ACTION: ', state);
    switch (state) {
      case Game.GameRunState('InProgress'):
        return gameRepo.actions.startGame;
      case Game.GameRunState('GameOver'):
        return gameRepo.actions.stopGame;
      case Game.GameRunState('Stop'):
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
