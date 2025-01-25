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
import { getGridConfig, gridSizeToMatrix } from '../../Domain/Grid.domain';
import type {
  TetrisBoardState,
  TetrisGameConfig,
  TetrisGameState,
} from '../../Domain/Tetris.domain';
import { createGridManager, getRandomTetromino } from '../../Domain/Tetromino.domain';

export const useGameState = () => {
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const gameConfig: TetrisGameConfig = {
    showHiddenCells: useSharedValue(true),
    size: useSharedValue({ columns: 10, rows: 24 }),
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
    dropPosition: {
      x: useSharedValue(0),
      y: useSharedValue(0),
    },
    gridConfig,
    grid: useSharedValue(gridSizeToMatrix(gameConfig.size.value)),
    tetromino: {
      current: useSharedValue(
        getRandomTetromino(gameConfig.size.value, gridConfig.value.cell.size),
      ),
      next: useSharedValue(
        getRandomTetromino(gameConfig.size.value, gridConfig.value.cell.size),
      ),
    },
    lastTouchedX: useSharedValue<number | null>(null),
  };

  const gridSkImage = useSharedValue<SkImage | null>(null);

  const gridManager = createGridManager(boardState.grid);

  const resetPosition = () => {
    'worklet';
    boardState.dropPosition.x.value = 0;
    boardState.dropPosition.y.value = 0;
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
    resetPosition();
    boardState.grid.value = gridSizeToMatrix(gridConfig.value);
    boardState.tetromino.current.value = getRandomTetromino(
      gameConfig.size.value,
      gridConfig.value.cell.size,
    );
    boardState.tetromino.next.value = getRandomTetromino(
      gameConfig.size.value,
      gridConfig.value.cell.size,
    );
    gridSkImage.value = gridManager.draw(
      gridConfig.value,
      gameConfig.showHiddenCells.value,
    );
  };

  const startNewGame = () => {
    'worklet';
    resetBoardState();
    resetGameState();
  };

  const moveShapeXAxis = (sumX: number, absoluteX: number) => {
    'worklet';
    const currentPos = point(
      boardState.dropPosition.x.value,
      boardState.dropPosition.y.value,
    );
    const nextPosition = add(currentPos, point(sumX, 0));
    const collision = gridManager.checkCollisions(
      nextPosition,
      boardState.tetromino.current.value,
    );
    if (!collision.outsideGrid && !collision.merge) {
      cancelAnimation(boardState.dropPosition.x);
      boardState.dropPosition.x.value = withTiming(nextPosition.x, {
        easing: Easing.linear,
        duration: 50,
        reduceMotion: ReduceMotion.Never,
      });
      boardState.lastTouchedX.value = absoluteX;
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
    resetPosition();
    gameState.turbo.value = false;
    boardState.tetromino.current.value = boardState.tetromino.next.value;
    boardState.tetromino.next.value = getRandomTetromino(
      gridConfig.value,
      gridConfig.value.cell.size,
    );
  };

  const mergeCurrentTetromino = () => {
    'worklet';
    gridManager.mergeTetromino({
      cellsMatrix: boardState.tetromino.current.value.cellsMatrix,
      color: boardState.tetromino.current.value.color,
      matrix: boardState.tetromino.current.value.matrix,
      name: boardState.tetromino.current.value.name,
      position: point(boardState.dropPosition.x.value, boardState.dropPosition.y.value),
    });
    gridSkImage.value = gridManager.draw(
      gridConfig.value,
      gameConfig.showHiddenCells.value,
    );
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
    },
    gridManager,
    gridSkImage,
    actions: {
      startNewGame,
      moveShapeXAxis,
      onGameOver,
      swapShapes,
      mergeCurrentTetromino,
    },
  };
};
