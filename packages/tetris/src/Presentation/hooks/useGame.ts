import { type SkPoint, point } from '@shopify/react-native-skia';
import {
  Easing,
  ReduceMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { matrixToPoints } from '../../Domain/Grid.domain';
import { useCurrentShape } from './useCurrentShape';
import { useGrid } from './useGrid';

export const useGame = () => {
  const grid = useGrid();
  const currentShape = useCurrentShape(grid.gridConfig);

  const gameState = {
    speed: useSharedValue(800),
    running: useSharedValue(0),
    gameOver: useSharedValue(0),
    startTime: useSharedValue(Date.now()),
    turboActive: useSharedValue(false),
  };

  const resetPosition = () => {
    'worklet';
    currentShape.position.x.value = 0;
    currentShape.position.y.value = 0;
  };

  const mergeShape = () => {
    'worklet';
    grid.drawShape(currentShape.shape, {
      x: Math.floor(currentShape.position.x.value),
      y: Math.floor(currentShape.position.y.value),
    });
    grid.clearLines()
    resetPosition();
    currentShape.nextTetromino();
    currentShape.collided.value = false;
  };

  const moveTetromino = (to: SkPoint) => {
    'worklet';
    const isValidMove = grid.isValidPosition(to, currentShape.shape.value.matrix);
    if (isValidMove) {
      currentShape.position.x.value = to.x;
      currentShape.position.y.value = withTiming(to.y, {
        duration: 100,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.Never,
      });
    }
  };

  const rotateTetromino = () => {
    'worklet';
    currentShape.shape.set((prev) => {
      // Make the rows to become cols (transpose)
      const nextMatrix = prev.matrix
        .map((_, i) => prev.matrix.map((column) => column[i]))
        .map((row) => row.reverse());
      // Reverse each row to get a rotated matrix
      const currentPos = point(
        currentShape.position.x.value,
        currentShape.position.y.value,
      );
      if (grid.isValidPosition(currentPos, nextMatrix)) {
        prev.matrix = nextMatrix;
        prev.cells = matrixToPoints(nextMatrix);
      }
      return prev;
    });
  };

  return {
    gameState,
    grid: {
      matrix: grid.matrix,
      config: grid.gridConfig,
    },
    tetromino: {
      shape: currentShape.shape,
      color: currentShape.color,
      skPath: currentShape.skShapePath,
      collided: currentShape.collided,
      position: currentShape.position,
    },
    actions: {
      rotateTetromino,
      moveTetromino,
      resetPosition,
      mergeShape,
      isValidPosition: grid.isValidPosition,
    },
  };
};
