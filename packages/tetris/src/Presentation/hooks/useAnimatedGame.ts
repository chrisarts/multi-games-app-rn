import { type SkPoint, add, point } from '@shopify/react-native-skia';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  type TetrisCollision,
  getRandomTetromino,
  rotateTetromino,
} from '../../Domain/Tetromino.domain';
import { useGameContext } from '../context/GameContext';
import { useTetrisGrid } from './useTetrisGrid';

export const useAnimatedGame = () => {
  const { gridConfig } = useGameContext();
  const { mergedGrid, checkCollisions, gridClip } = useTetrisGrid();
  const first = getRandomTetromino(gridConfig, gridConfig.cell.size);
  const tetromino = useSharedValue(first);
  const dropPosition = { x: useSharedValue(0), y: useSharedValue(0) };

  const gameState = {
    speed: useSharedValue(800),
    startTime: useSharedValue(Date.now()),
    running: useSharedValue(true),
    gameOver: useSharedValue(false),
  };
  const moves = {
    moveX: useSharedValue(0),
    turbo: useSharedValue(false),
    lastTouchedX: useSharedValue<number | null>(null),
  };

  const onMoveTetromino = (action: {
    unit: SkPoint;
    onCollision?: (collision: TetrisCollision) => void;
    beforeMove?: (collision: TetrisCollision) => void;
    afterMove?: (toPos: SkPoint, collision: TetrisCollision) => void;
  }) => {
    'worklet';
    const currentPos = point(dropPosition.x.value, dropPosition.y.value);
    const nextPos = add(currentPos, action.unit);
    const collision = checkCollisions(nextPos, tetromino.value);
    if (!collision.outsideGrid && !collision.merge) {
      action.beforeMove?.(collision);
      if (Math.abs(action.unit.x) > 0) {
        dropPosition.x.value = withTiming(nextPos.x, {
          easing: Easing.linear,
          duration: 50,
          reduceMotion: ReduceMotion.Never,
        });
      }
      if (Math.abs(action.unit.y) > 0) {
        dropPosition.y.value = withTiming(nextPos.y, {
          easing: Easing.linear,
          duration: 100,
          reduceMotion: ReduceMotion.Never,
        });
      }
    }
    action.afterMove?.(nextPos, collision);
  };

  const moveX = Gesture.Pan()
    .onBegin((e) => {
      moves.lastTouchedX.value = e.absoluteX;
    })
    .onChange((e) => {
      if (!moves.lastTouchedX.value) return;

      if (Math.abs(e.translationY) > gridConfig.cell.size * 2) {
        moves.turbo.value = e.translationY > 0;
        return;
      }

      const minMoveX = gridConfig.cell.size * 0.5;
      if (Math.abs(e.absoluteX - moves.lastTouchedX.value) > minMoveX) {
        const moveStepX = e.velocityX > 0 ? 1 : -1;
        onMoveTetromino({
          unit: point(moveStepX, 0),
          beforeMove: () => {
            'worklet';
            cancelAnimation(dropPosition.x);
          },
          afterMove: () => {
            'worklet';
            moves.lastTouchedX.value = e.absoluteX;
          },
        });
      }
    })
    .onEnd(() => {
      moves.moveX.value = 0;
    })
    .minDistance(gridConfig.cell.size * 0.5)
    .maxPointers(1);

  const rotate = Gesture.Tap().onTouchesUp(() => {
    const rotatedShape = rotateTetromino(tetromino.value);
    const currentPos = point(dropPosition.x.value, dropPosition.y.value);

    const collisions = checkCollisions(currentPos, rotatedShape);
    let blockMove = collisions.outsideGrid || collisions.merge;

    if (blockMove && currentPos.x <= 0) {
      const collisions = checkCollisions(add(currentPos, point(1, 0)), rotatedShape);
      blockMove = collisions.outsideGrid || collisions.merge;
      if (!blockMove) {
        dropPosition.x.value += 1;
      }
    }

    if (blockMove && currentPos.x === gridConfig.columns - 1) {
      const collisions = checkCollisions(add(currentPos, point(-1, 0)), rotatedShape);
      blockMove = collisions.outsideGrid || collisions.merge;
      if (!blockMove) {
        dropPosition.x.value -= 1;
      }
    }

    if (blockMove) return;
    tetromino.value = rotatedShape;
  });

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;
    const elapsed = Date.now() - gameState.startTime.value;
    const toSpeed = moves.turbo.value ? 100 : gameState.speed.value;

    if (elapsed > toSpeed) {
      gameState.startTime.value = Date.now();
      if (!gameState.running.value || gameState.gameOver.value) return;

      const nextPos = add(point(dropPosition.x.value, dropPosition.y.value), point(0, 1));

      const collision = checkCollisions(nextPos, tetromino.value);

      if (!collision.merge && !collision.outsideGrid) {
        dropPosition.y.value = withTiming(nextPos.y, {
          duration: 100,
          easing: Easing.linear,
        });
      }

      if (collision.merge) {
        if (collision.at.y <= 1) {
          gameState.gameOver.value = true;
          gameState.running.value = false;
          return;
        }

        const nextShape = getRandomTetromino(gridConfig, gridConfig.cell.size);
        mergedGrid.addMergedTetromino({
          cellsMatrix: tetromino.value.cellsMatrix,
          color: tetromino.value.color,
          matrix: tetromino.value.matrix,
          name: tetromino.value.name,
          position: point(dropPosition.x.value, dropPosition.y.value),
        });

        moves.turbo.value = false;
        const nextCollision = checkCollisions(point(0, 0), nextShape);
        if (nextCollision.merge && nextCollision.at.y < 1) {
          gameState.gameOver.value = true;
          gameState.running.value = false;
          return;
        }
        // tetromino.resetPosition();
        tetromino.value = nextShape;
        dropPosition.x.value = 0;
        dropPosition.y.value = 0;
      }
    }
  });

  return {
    gameState,
    tetromino,
    dropPosition,
    gestures: { rotate, moveX },
    moves,
    grid: {
      clip: gridClip,
      config: gridConfig,
      mergedGrid,
    },
  };
};
