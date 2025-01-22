import { type SkPoint, add, point, processTransform3d, rrect, usePathValue } from '@shopify/react-native-skia';
import { Gesture } from 'react-native-gesture-handler';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { getCellUIRect, matrixToPoints } from '../../Domain/Grid.domain';
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
    grid.clearLines();
    resetPosition();
    currentShape.nextTetromino();
    currentShape.collided.value = false;
  };

  const moveTetromino = (sum: SkPoint) => {
    'worklet';
    const nextPosition = add(currentShape.currentPosition.value, sum);
    const isValidMove = grid.isValidPosition(
      nextPosition,
      currentShape.shape.value.matrix,
    );

    if (isValidMove) {
      currentShape.position.x.value = nextPosition.x;
      currentShape.position.y.value = nextPosition.y;
      return;
    }
    console.log('NEXT_POS: ', nextPosition.y);
    if (nextPosition.y >= grid.matrix.length - 1) {
      mergeShape();
    }
  };

  const rotateTetromino = () => {
    'worklet';
    currentShape.shape.set((prev) => {
      const { currentPos, nextMatrix } = currentShape.rotateShape();
      if (grid.isValidPosition(currentPos, nextMatrix)) {
        prev.matrix = nextMatrix;
        prev.cells = matrixToPoints(nextMatrix);
      }
      return prev;
    });
  };

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;
    const elapsed = Date.now() - gameState.startTime.value;
    const toSpeed = gameState.turboActive.value ? 100 : gameState.speed.value;

    if (elapsed > toSpeed && !currentShape.collided.value) {
      moveTetromino({ x: 0, y: 1 });
      gameState.startTime.value = Date.now();
    }
  });

  const gesture = Gesture.Pan()
    .onChange((e) => {
      const currentPos = currentShape.currentPosition.value;
      const currentXPosition = currentPos.x;
      const nextXPosition = Math.floor(e.absoluteX / grid.gridConfig.cellContainerSize);
      console.log('TO_POS_X', {
        currentXPosition,
        nextXPosition,
        moveTo:
          currentXPosition < nextXPosition
            ? nextXPosition - currentXPosition
            : currentXPosition - nextXPosition,
      });
      moveTetromino(
        point(
          currentXPosition < nextXPosition
            ? nextXPosition - currentXPosition
            : nextXPosition - currentXPosition,
          0,
        ),
      );
    })
    .minDistance(grid.gridConfig.cellContainerSize * 1.5)
    .failOffsetY(grid.gridConfig.cellContainerSize / 2)
    .maxPointers(1);

  const accelerate = Gesture.Pan()
    .onChange((e) => {
      if (e.changeY > 0) {
        gameState.turboActive.value = true;
      } else {
        gameState.turboActive.value = false;
      }
    })
    .minDistance(grid.gridConfig.cellContainerSize * 2)
    .activeOffsetY(grid.gridConfig.cellContainerSize * 2)
    .failOffsetX(grid.gridConfig.cellContainerSize / 2)
    .maxPointers(1);

  const tap = Gesture.Tap().onEnd((e) => {
    rotateTetromino();
  });

  const skShapePath = usePathValue((skPath) => {
    'worklet';
    for (const cell of currentShape.shape.value.cells) {
      if (cell.value === 0) continue;
      skPath.addPath;
      skPath.addRRect(
        rrect(getCellUIRect(cell.point, grid.gridConfig.cellContainerSize), 5, 5),
      );
    }
    skPath.transform(
      processTransform3d([
        {
          translate: [
            currentShape.currentPosition.value.x * grid.gridConfig.cellContainerSize,
            currentShape.currentPosition.value.y * grid.gridConfig.cellContainerSize,
          ] as const,
        },
      ]),
    );
    return skPath;
  });

  return {
    gameState,
    accelerate,
    grid: {
      gesture,
      tap,
      matrix: grid.matrix,
      config: grid.gridConfig,
    },
    tetromino: {
      skShapePath,
      shape: currentShape.shape,
      location: currentShape.position,
      color: currentShape.color,
      collided: currentShape.collided,
      position: currentShape.currentPosition,
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
