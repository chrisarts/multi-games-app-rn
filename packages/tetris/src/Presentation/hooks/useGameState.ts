import { Skia, add, point, rect, rrect } from '@shopify/react-native-skia';
import {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { TetrisGameState } from '../../Domain/Tetris.domain';
import type { Tetromino } from '../../Domain/Tetromino.domain';
import { useBoardState } from './useBoardState';
import { usePlayerState } from './usePlayerState';
import { useTetrisFont } from './useTetrisFont';

export const useGameState = () => {
  const fonts = useTetrisFont();
  const playerState = usePlayerState();
  const board = useBoardState();
  const ghostShapeSkPath = useSharedValue(
    getGhostShapePath(playerState.tetromino.value, board.gridConfig.value.cell.size),
  );

  const gameState: TetrisGameState = {
    gameOver: useSharedValue(false),
    level: useSharedValue(1),
    lines: useSharedValue(0),
    running: useSharedValue(false),
    speed: useSharedValue(800),
    turbo: useSharedValue(false),
    startTime: useSharedValue(Date.now()),
  };

  const resetGameState = () => {
    'worklet';
    gameState.level.value = 1;
    gameState.running.value = true;
    gameState.gameOver.value = false;
    gameState.speed.value = 800;
    gameState.turbo.value = false;
    gameState.lines.value = 0;
  };

  const startNewGame = () => {
    'worklet';
    resetGameState();
    if (gameState.gameOver.value) {
      playerState.reset();
    }
  };

  const moveShapeXAxis = (sumX: number, absoluteX: number) => {
    'worklet';
    const currentPos = point(playerState.position.x.value, playerState.position.y.value);
    const nextPosition = add(currentPos, point(sumX, 0));
    const collision = board.checkCollisions(nextPosition, playerState.tetromino.value);

    if (!collision.outsideGrid && !collision.merge) {
      cancelAnimation(playerState.position.x);
      playerState.position.x.value = withTiming(nextPosition.x, {
        easing: Easing.linear,
        duration: 50,
        reduceMotion: ReduceMotion.Never,
      });
      playerState.lastTouchedX.value = absoluteX;
    }
  };

  const onGameOver = () => {
    'worklet';
    gameState.gameOver.value = true;
    gameState.running.value = false;
    gameState.speed.value = 800;
    gameState.turbo.value = false;
  };

  const mergeCurrentTetromino = () => {
    'worklet';
    const sweepedLines = board.mergeTetromino(
      playerState.tetromino.value,
      point(playerState.position.x.value, playerState.position.y.value),
    );
    gameState.lines.value += sweepedLines;
    gameState.turbo.value = false;
    if (playerState.position.y.value <= 1) {
      onGameOver();
      return;
    }
    playerState.nextTetromino();
    ghostShapeSkPath.value = getGhostShapePath(
      playerState.tetromino.value,
      board.gridConfig.value.cell.size,
    );
  };

  const dropPosition = useDerivedValue(() => {
    const base = point(
      playerState.tetromino.value.position.x,
      board.gridConfig.value.rows - 1 - playerState.tetrominoMaxY.value,
    );
    if (board.grid.value[board.grid.value.length - 1].every((cell) => cell.value === 0)) {
      console.log('ITS_CERO');
      return base;
    }
    return point(playerState.position.x.value, playerState.position.y.value);
  });

  return {
    state: {
      game: gameState,
      board,
      dropPosition,
    },
    ghostShapeSkPath,
    player: playerState,
    fonts,
    actions: {
      startNewGame,
      moveShapeXAxis,
      onGameOver,
      mergeCurrentTetromino,
    },
  };
};

const getGhostShapePath = (tetromino: Tetromino, cellSize: number) => {
  const skPath = Skia.Path.Make();
  for (const cell of tetromino.shape) {
    const cellR = rect(cell.x * cellSize, cell.y * cellSize, cellSize - 1, cellSize - 1);
    skPath.addRRect(rrect(cellR, 5, 5));
  }
  return skPath;
};
