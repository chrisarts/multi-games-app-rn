import { interpolateColors } from '@shopify/react-native-skia';
import { HashMap, Option, Ref } from 'effect';
import { withTime } from 'effect/Console';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import { defaultCellColor } from '../Domain/Cell.domain';
import * as Game from '../Domain/Game.domain';
import * as GridBound from '../Domain/GridBound.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';
import * as GameStore from '../Store/Game.store';
import { GridRepoContext, GridRepoContextLive } from './GridStore.service';
import { createEffectStore } from './Store.service';

const make = Effect.gen(function* () {
  const gameStore = yield* createEffectStore(GameStore.GameStore);
  const gridRepo = yield* GridRepoContext;

  const swapTetrominos = gridRepo.gridStore
    .selector((state) => state.layout)
    .pipe(
      Effect.andThen((layout) =>
        gameStore.unsafeSetState((state) => {
          state.currentTetromino = state.nextTetromino;
          state.nextTetromino = Tetromino.getRandomTetromino();
          state.dropPosition = layout.initialPosition;
        }),
      ),
    );

  const updateDropPosition = (to: Position.Position) =>
    gameStore.unsafeSetState((state) => {
      state.dropPosition = to;
    });

  const startGame = gameStore.unsafeSetState(
    (state) => (state.gameStatus = Game.GameRunState('InProgress')),
  );
  const stopGame = gameStore.unsafeSetState(
    (state) => (state.gameStatus = Game.GameRunState('Stop')),
  );
  const setGameOver = gameStore.unsafeSetState(
    (state) => (state.gameStatus = Game.GameRunState('GameOver')),
  );
  const resetGame = gameStore.unsafeSetState(
    (x) =>
      (x = {
        currentTetromino: Tetromino.getRandomTetromino(),
        dropPosition: Position.zero(),
        nextTetromino: Tetromino.getRandomTetromino(),
        gameStatus: Game.GameRunState('Stop'),
        speed: 800,
      }),
  );

  return {
    selector: gameStore.selector,
    addListener: gameStore.listenStateChanges,
    store: gameStore.store,
    listenChanges: gameStore.listenStateChanges,
    getMoveUnitState,
    unsafeUpdateBoard,
    actions: {
      updateDropPosition,
      resetGame,
      swapTetrominos,
      startGame,
      stopGame,
      setGameOver,
    },
  };

  // If any provided position is invalid this will throw
  function unsafeUpdateBoard(data: {
    tetromino: Tetromino.Tetromino;
    toPositions: Position.Position[];
    fromPositions: Position.Position[];
    updatedPosition: Position.Position;
    merge: boolean;
  }) {
    return Effect.gen(function* () {
      console.log('UPDATE: ', {
        moveTo: data.updatedPosition,
        merge: data.merge,
      });
      const store = yield* gameStore.store;
      const layout = yield* gridRepo.selector((x) => x.layout);

      yield* gridRepo.unsafeSetState((x) => {
        const drawPositions = data.tetromino.drawPositions.map((position) =>
          Position.sum(store.getState().dropPosition, position),
        );
        for (const position of drawPositions) {
          const cell = HashMap.get(x.cellsMap, position);
          if (Option.isNone(cell)) continue;
          if (cell.value.state.merged) continue;

          cell.value.state = {
            color: defaultCellColor,
            merged: false,
          };
        }

        for (const position of Tetromino.mapWithPosition(
          data.tetromino,
          data.updatedPosition,
        ).positions) {
          const cell = HashMap.get(x.cellsMap, position);
          if (Option.isNone(cell)) continue;
          if (cell.value.state.merged) continue;

          cell.value.state = {
            color: data.tetromino.color,
            merged: data.merge,
          };
        }
      });
      store.setState((x) => {
        if (data.merge) {
          x.dropPosition = layout.initialPosition;
          x.currentTetromino = x.nextTetromino;
          x.nextTetromino = Tetromino.getRandomTetromino();
        } else {
          x.dropPosition = data.updatedPosition;
        }
        return x;
      });
      if (data.merge) {
        yield* swapTetrominos;
      }
    }).pipe(Effect.tap(() => Effect.log('Board updated')));
  }

  function getMoveUnitState(moveUnit: Position.Position) {
    return Effect.gen(function* () {
      const gridBounds = yield* gridRepo.selector((x) => x.bounds);
      const state = yield* gameStore.selector((x) => x);
      const currentPos = state.dropPosition;
      const tetromino = state.currentTetromino;
      const nextPosition = Position.sum(currentPos, moveUnit);
      const nextDraw = Tetromino.mapWithPosition(tetromino, nextPosition);

      const rowBoundValid = GridBound.bothRowBoundsValid(gridBounds, nextDraw.bounds);
      const minRowValid = GridBound.rowBoundValid(gridBounds, nextDraw.bounds.min);
      const gameOver = !rowBoundValid && !minRowValid;
      const merge = !GridBound.rowBoundValid(gridBounds, nextDraw.bounds.max);
      const insideGrid = GridBound.validateBounds(gridBounds, nextDraw.bounds);

      return {
        gameOver,
        merge,
        nextPosition,
        insideGrid,
        nextDraw,
        tetromino,
        currentPos,
        gridBounds,
      };
    });
  }
});

export interface GameRepoContext extends Effect.Effect.Success<typeof make> {}
export const GameRepoContext = Context.GenericTag<GameRepoContext>('GameRepoContext');
export const GameRepoContextLive = Layer.effect(GameRepoContext, make).pipe(
  Layer.provide(GridRepoContextLive),
);
