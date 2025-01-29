import { add, point } from '@shopify/react-native-skia';
import {
  Easing,
  ReduceMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { TetrisGameState } from '../../Domain/Tetris.domain';
import { useBoardState } from './useBoardState';
import { usePlayerState } from './usePlayerState';
import { useTetrisFont } from './useTetrisFont';

export const useGameState = () => {
  const fonts = useTetrisFont();
  const playerState = usePlayerState();
  const board = useBoardState();

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
    if (gameState.gameOver.value) {
      playerState.reset();
    }
    board.reset();
    resetGameState();
  };

  const moveShapeXAxis = (sumX: number, absoluteX: number) => {
    'worklet';
    const currentPos = playerState.absPosition.value;
    const nextPosition = add(currentPos, point(sumX, 0));
    const collision = board.checkCollisions(nextPosition, playerState.tetromino.value);

    if (!collision.outsideGrid && !collision.merge) {
      // cancelAnimation(playerState.position.x);
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
    board.mergeTetromino(
      playerState.tetromino.value,
      point(playerState.position.x.value, Math.ceil(playerState.position.y.value)),
    );

    gameState.lines.value += board.sweepLines();
    gameState.turbo.value = false;
    board.draw();
    if (playerState.position.y.value <= 1) {
      onGameOver();
      return;
    }

    playerState.nextTetromino();
  };

  return {
    state: {
      game: gameState,
      board,
    },
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
