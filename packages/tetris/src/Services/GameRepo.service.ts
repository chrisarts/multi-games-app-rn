import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Game from '../Domain/Game.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';
import * as GameStore from '../Store/Game.store';
import { createEffectStore } from '../utils/effect.utils';
import { GridRepoContext } from './GridStore.service';

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
    store: gameStore.store,
    listenChanges: gameStore.listenStateChanges,
    actions: {
      updateDropPosition,
      resetGame,
      swapTetrominos,
      startGame,
      stopGame,
      setGameOver,
    },
  };
});

export interface GameRepoContext extends Effect.Effect.Success<typeof make> {}
export const GameRepoContext = Context.GenericTag<GameRepoContext>('GameRepoContext');
export const GameRepoContextLive = Layer.effect(GameRepoContext, make);
