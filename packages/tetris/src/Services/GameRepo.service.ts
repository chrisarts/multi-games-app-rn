import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as HashMap from 'effect/HashMap';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import * as Cell from '../Domain/Cell.domain';
import * as Grid from '../Domain/Grid.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';
import * as GameStore from '../Store/Game.store';
import { createEffectStore } from './Store.service';

const make = Effect.gen(function* () {
  const gameStore = yield* createEffectStore(GameStore.GameStore);

  const swapTetrominos = gameStore.unsafeSetState((state) => {
    state.tetromino.current = state.tetromino.next;
    state.tetromino.next = Tetromino.getRandomTetromino();
    state.tetromino.position = state.grid.layout.initialPosition;
  });

  const updateDropPosition = (to: SkPoint) =>
    gameStore.unsafeSetState((state) => {
      state.tetromino.position = to;
    });

  const startGame = gameStore.unsafeSetState((state) => {
    GameStore.StoreActions.refreshGrid(
      state.tetromino.current,
      state.tetromino.position,
      false,
    );
    state.game.status = 'InProgress';
  });
  const stopGame = gameStore.unsafeSetState((state) => (state.game.status = 'Stop'));
  const setGameOver = gameStore.unsafeSetState(
    (state) => (state.game.status = 'GameOver'),
  );
  const resetGame = gameStore.unsafeSetState(
    (x) =>
      (x = {
        game: {
          status: 'Stop',
          speed: 800,
        },
        grid: x.grid,
        tetromino: {
          current: Tetromino.getRandomTetromino(),
          next: Tetromino.getRandomTetromino(),
          position: x.grid.layout.initialPosition,
        },
        debug: x.debug,
      }),
  );

  const getCellAt = (position: SkPoint) =>
    gameStore.selector((x) => HashMap.get(x.grid.cellsMap, position));

  const mutateCellAt = (position: SkPoint, f: (cell: Cell.Cell) => void) =>
    gameStore.unsafeSetState((state) => {
      HashMap.get(state.grid.cellsMap, position).pipe(Option.map(f));
    });

  const mapCellState = (position: SkPoint, f: (cell: Cell.Cell) => Cell.Cell) =>
    gameStore.unsafeSetState((state) => {
      HashMap.modify(state.grid.cellsMap, position, f);
      return state;
    });

  return {
    selector: gameStore.selector,
    addListener: gameStore.listenStateChanges,
    store: gameStore.store,
    listenChanges: gameStore.listenStateChanges,
    getMoveUnitState,
    unsafeUpdateBoard,
    actions: {
      getCellAt,
      mutateCellAt,
      mapCellState,
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
    toPositions: SkPoint[];
    fromPositions: SkPoint[];
    updatedPosition: SkPoint;
    merge: boolean;
  }) {
    return Effect.gen(function* () {
      const store = yield* gameStore.store;
      const layout = store.getState().grid.layout;

      yield* gameStore.unsafeSetState((x) => {
        const drawPositions = data.tetromino.drawPositions.map((position) =>
          Position.sum(store.getState().tetromino.position, position),
        );
        for (const position of drawPositions) {
          const cell = HashMap.get(x.grid.cellsMap, position);
          if (Option.isNone(cell)) continue;
          if (cell.value.state.merged) continue;

          cell.value.state = {
            color: Cell.defaultCellColor,
            merged: false,
          };
        }

        for (const position of Tetromino.mapWithPosition(
          data.tetromino,
          data.updatedPosition,
        ).positions) {
          const cell = HashMap.get(x.grid.cellsMap, position);
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
          x.tetromino.position = layout.initialPosition;
          x.tetromino.current = x.tetromino.next;
          x.tetromino.next = Tetromino.getRandomTetromino();
        } else {
          x.tetromino.position = data.updatedPosition;
        }
        return x;
      });
      if (data.merge) {
        yield* swapTetrominos;
      }
    });
    // .pipe(Effect.tap(() => Effect.log('Board updated')));
  }

  function getMoveUnitState(moveUnit: SkPoint) {
    return Effect.gen(function* () {
      const gridBounds = yield* gameStore.selector((x) => x.grid.bounds);
      const state = yield* gameStore.selector((x) => x);
      const currentPos = state.tetromino.position;
      const tetromino = state.tetromino.current;
      const nextPosition = Position.sum(currentPos, moveUnit);
      const nextDraw = Tetromino.mapWithPosition(tetromino, nextPosition);

      const rowBoundValid = Grid.bothRowBoundsValid(gridBounds, nextDraw.bounds);
      const minRowValid = Grid.rowBoundValid(gridBounds, nextDraw.bounds.min);
      const gameOver = !rowBoundValid && !minRowValid;
      const merge = !Grid.rowBoundValid(gridBounds, nextDraw.bounds.max);
      const insideGrid = Grid.validateBounds(gridBounds, nextDraw.bounds);

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
export const GameRepoContextLive = Layer.effect(GameRepoContext, make);
