import { Duration, HashMap } from 'effect';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Queue from 'effect/Queue';
import * as Game from '../Domain/Game.domain';
import * as GameAction from '../Domain/GameAction.domain';
import * as Position from '../Domain/Position.domain';
import { GameRepoContext } from './GameRepo.service';
import { GridRepoContext } from './GridStore.service';
import { PlayerContext } from './Player.service';
import { TetrisLayer } from './Runtime.layers';

export const make = Effect.gen(function* () {
  const gameRepo = yield* GameRepoContext;
  const gridRepo = yield* GridRepoContext;
  const { playerActions } = yield* PlayerContext;

  yield* gameRepo.listenChanges((state) =>
    Effect.gen(function* () {
      yield* Effect.log('GAME_STATE_CHANGE: ', state.gameStatus);
    }),
  );
  // .pipe(Effect.fork);

  yield* gridRepo.listen((state) =>
    Effect.gen(function* () {
      yield* Effect.log('GAME_STATE_CHANGE: ', HashMap.size(state.cellsMap));
    }),
  );
  // .pipe(Effect.fork);

  const updatesDequeue = yield* Queue.take(playerActions).pipe(
    Effect.tap((action) => Effect.log(`Received action: ${action._tag}`)),
    Effect.andThen((action) =>
      GameAction.GameAction.$match(action, {
        move: (x) => onMoveAction(x.to),
        rotate: (x) => onMoveAction(x.to),
        statusChange: (x) => onStatusAction(x.state),
      }),
    ),
    Effect.forever,
    Effect.fork,
  );

  const isRunning = gameRepo
    .selector((x) => x.gameStatus)
    .pipe(Effect.map((x) => x !== Game.GameRunState('GameOver')));

  // while (yield* isRunning) {
  //   yield* Effect.log('Running...');
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
  return {
    updatesDequeue,
  };

  function onMoveAction(moveTo: Position.Position) {
    return Effect.gen(function* () {
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
}).pipe(Effect.tap(() => Effect.log('Provided Game service ctx')));

export interface GameContext extends Effect.Effect.Success<typeof make> {}
export const GameContext = Context.GenericTag<GameContext>('GameContext');
export const GameContextLive = Layer.scoped(GameContext, make).pipe(
  Layer.provide(TetrisLayer),
);
