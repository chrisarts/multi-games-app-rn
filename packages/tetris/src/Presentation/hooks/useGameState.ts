import { type SkImage, add, point } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  createGridManager,
  getGridConfig,
  gridSizeToMatrix,
} from '../../Domain/Grid.domain';
import type {
  TetrisBoardState,
  TetrisGameConfig,
  TetrisGameState,
  TetrisPlayerState,
} from '../../Domain/Tetris.domain';
import {
  type Tetromino,
  createTetrominoManager,
  generateBag,
  getRandomTetromino,
} from '../../Domain/Tetromino.domain';
import { useTetrisFont } from './useTetrisFont';

export const useGameState = () => {
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const fonts = useTetrisFont();
  const tetrominosBag = useSharedValue<Tetromino[]>(generateBag());
  const tetrominoManager = createTetrominoManager(tetrominosBag);
  const currentTetromino = useSharedValue(getRandomTetromino());
  const playerState: TetrisPlayerState = {
    position: {
      x: useSharedValue(currentTetromino.value.position.x),
      y: useSharedValue(currentTetromino.value.position.y),
    },
    tetromino: currentTetromino,
    lastTouchedX: useSharedValue<number | null>(null),
    bag: tetrominosBag,
  };
  const gameConfig: TetrisGameConfig = {
    showHiddenCells: useSharedValue(true),
    size: useSharedValue({ columns: 10, rows: 22 }),
  };

  const gameState: TetrisGameState = {
    gameOver: useSharedValue(false),
    level: useSharedValue(1),
    lines: useSharedValue(0),
    running: useSharedValue(false),
    speed: useSharedValue(800),
    turbo: useSharedValue(false),
    startTime: useSharedValue(Date.now()),
  };
  const gridConfig = useSharedValue(
    getGridConfig(dimensions, insets, gameConfig.size.value),
  );
  const boardState: TetrisBoardState = {
    gridConfig,
    grid: useSharedValue(gridSizeToMatrix(gameConfig.size.value)),
  };

  const gridSkImage = useSharedValue<SkImage | null>(null);

  const gridManager = createGridManager(boardState.grid);

  const resetPosition = () => {
    'worklet';
    playerState.position.x.value = currentTetromino.value.position.x;
    playerState.position.y.value = currentTetromino.value.position.y;
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
  const resetBoardState = () => {
    'worklet';
    boardState.grid.value = gridSizeToMatrix(gridConfig.value);
    gridSkImage.value = gridManager.draw(
      gridConfig.value,
      gameConfig.showHiddenCells.value,
    );
  };

  const resetPlayerState = () => {
    'worklet';
    tetrominoManager.fillBag();
    playerState.tetromino.value = tetrominoManager.nextTetromino();
    resetPosition();
  };

  const startNewGame = () => {
    'worklet';
    resetBoardState();
    resetGameState();
    if (gameState.gameOver.value) {
      resetPlayerState();
    }
  };

  const moveShapeXAxis = (sumX: number, absoluteX: number) => {
    'worklet';
    const currentPos = point(playerState.position.x.value, playerState.position.y.value);
    const nextPosition = add(currentPos, point(sumX, 0));
    const collision = gridManager.checkCollisions(
      nextPosition,
      playerState.tetromino.value,
    );
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

  const swapShapes = () => {
    'worklet';
    if (gameState.gameOver.value) return;
    resetPosition();
    gameState.turbo.value = false;
    playerState.tetromino.value = tetrominoManager.nextTetromino();
  };

  const mergeCurrentTetromino = () => {
    'worklet';
    const sweepedLines = gridManager.mergeTetromino({
      ...playerState.tetromino.value,
      position: point(playerState.position.x.value, playerState.position.y.value),
    });
    gameState.lines.value += sweepedLines;
    gridSkImage.value = gridManager.draw(
      gridConfig.value,
      gameConfig.showHiddenCells.value,
    );
    if (playerState.position.y.value <= 1) {
      onGameOver();
    }
    swapShapes();
  };

  useEffect(() => {
    gridSkImage.value = gridManager.draw(
      gridConfig.value,
      gameConfig.showHiddenCells.value,
    );
  }, [gridSkImage, gridConfig, gridManager, gameConfig.showHiddenCells]);

  return {
    state: {
      config: gameConfig,
      game: gameState,
      board: boardState,
      player: playerState,
    },
    gridManager,
    gridSkImage,
    fonts,
    actions: {
      startNewGame,
      moveShapeXAxis,
      onGameOver,
      swapShapes,
      mergeCurrentTetromino,
    },
  };
};
