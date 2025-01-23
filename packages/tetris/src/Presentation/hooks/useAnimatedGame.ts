import { add, point } from '@shopify/react-native-skia';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { mergeShapeAt, shapeCollisionsAt } from '../../Domain/Grid.domain';
import { useGameContext } from '../context/GameContext';
import { useTetrisGame } from './useTetrisGame';

export const useAnimatedGame = () => {
  const { gridConfig, getRandomShapeIndex, allShapes } = useGameContext();
  const { gameState, tetromino, moves, tetrisMatrix } = useTetrisGame();
  const lastTouchedX = useSharedValue<number | null>(tetromino.position.x.value);

  const moveX = Gesture.Pan()
    .onBegin((e) => {
      moves.movingX.value = true;
      lastTouchedX.value = e.absoluteX;
    })
    .onChange((e) => {
      if (!moves.movingX.value || !lastTouchedX.value) return;

      if (Math.abs(e.translationY) > gridConfig.cellContainerSize * 2) {
        moves.turbo.value = e.translationY > 0;
        return;
      }

      const minMoveX = gridConfig.cellSize * 0.5;
      if (Math.abs(e.absoluteX - lastTouchedX.value) > minMoveX) {
        const moveStepX = e.velocityX > 0 ? 1 : -1;
        const currentPosition = point(
          tetromino.position.x.value,
          tetromino.position.y.value,
        );
        const nextPoint = add(currentPosition, point(moveStepX, 0));
        const collision = shapeCollisionsAt(
          nextPoint,
          tetromino.currentShape.value.cells,
          tetrisMatrix,
        );
        if (!collision.outsideGrid && !collision.merge) {
          cancelAnimation(tetromino.position.x);
          tetromino.position.x.value = withTiming(nextPoint.x, {
            easing: Easing.linear,
            duration: 50,
            reduceMotion: ReduceMotion.Never,
          });
          lastTouchedX.value = e.absoluteX;
        }
      }
    })
    .onEnd(() => {
      moves.movingX.value = false;
      moves.moveX.value = 0;
    })
    .minDistance(gridConfig.cellContainerSize * 0.7)
    .maxPointers(1);

  const rotate = Gesture.Tap().onTouchesUp(() => {
    tetromino.rotateTetromino();
  });

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;
    const elapsed = Date.now() - gameState.startTime.value;
    const toSpeed = moves.turbo.value ? 100 : gameState.speed.value;

    if (elapsed > toSpeed) {
      gameState.startTime.value = Date.now();
      if (!gameState.running.value || gameState.gameOver.value) return;

      const nextPos = add(
        point(tetromino.position.x.value, tetromino.position.y.value),
        point(0, 1),
      );

      const collision = shapeCollisionsAt(
        nextPos,
        tetromino.currentShape.value.cells,
        tetrisMatrix,
      );

      if (!collision.merge && !collision.outsideGrid) {
        tetromino.position.y.value = withTiming(nextPos.y, {
          duration: toSpeed / 2,
          easing: Easing.linear,
        });
      }

      if (collision.merge) {
        if (collision.at.y <= 1) {
          gameState.gameOver.value = true;
          gameState.running.value = false;
          return;
        }

        const nextShape = allShapes[getRandomShapeIndex()];
        mergeShapeAt(
          point(tetromino.position.x.value, tetromino.position.y.value),
          tetromino.currentShape,
          tetrisMatrix,
        );
        const nextCollision = shapeCollisionsAt(
          point(0, 0),
          nextShape.cells,
          tetrisMatrix,
        );
        if (nextCollision.merge && nextCollision.at.y < 1) {
          gameState.gameOver.value = true;
          gameState.running.value = false;
          return;
        }
        tetromino.resetPosition();
        tetromino.currentShape.value = nextShape;
      }
    }
  });

  return {
    gameState,
    tetromino,
    gestures: { rotate, moveX },
    moves,
    grid: {
      matrix: tetrisMatrix,
      config: gridConfig,
    },
  };
};
