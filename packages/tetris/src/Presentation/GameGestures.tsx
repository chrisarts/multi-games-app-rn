import { type SkPoint, add, point } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import type { GridConfig } from '../Domain/Grid.domain';
import type { AnimatedPosition } from '../Domain/Position.domain';
import {
  type TetrisCollision,
  type Tetromino,
  rotateTetromino,
} from '../Domain/Tetromino.domain';

interface GameGesturesProps {
  children: ReactNode;
  checkCollisions: (at: SkPoint, shape: Tetromino) => TetrisCollision;
  lastTouchedX: SharedValue<number | null>;
  gridConfig: SharedValue<GridConfig>;
  turbo: SharedValue<boolean>;
  running: SharedValue<boolean>;
  startNewGame: () => void;
  moveShapeXAxis: (to: number, absX: number) => void;
  tetromino: SharedValue<Tetromino>;
  position: AnimatedPosition;
}
export const GameGestures = ({
  children,
  checkCollisions,
  gridConfig,
  lastTouchedX,
  turbo,
  running,
  startNewGame,
  tetromino,
  position,
  moveShapeXAxis,
}: GameGesturesProps) => {
  const tetrisPan = Gesture.Pan()
    .onBegin((e) => {
      lastTouchedX.value = e.absoluteX;
    })
    .onChange((e) => {
      if (!lastTouchedX.value || !running.value) return;

      if (Math.abs(e.translationY) > gridConfig.value.cell.size * 2) {
        turbo.value = e.translationY > 0;
        return;
      }

      const minMoveX = gridConfig.value.cell.size * 0.5;
      if (Math.abs(e.absoluteX - lastTouchedX.value) > minMoveX) {
        moveShapeXAxis(e.velocityX > 0 ? 1 : -1, e.absoluteX);
      }
    })
    .minDistance(gridConfig.value.cell.size * 0.5)
    .maxPointers(1);

  const rotateTap = Gesture.Tap().onTouchesUp(() => {
    if (!running.value) {
      startNewGame();
      return;
    }
    const rotatedShape = rotateTetromino(tetromino.value);
    const currentPos = point(position.x.value, Math.floor(position.y.value));

    const collisions = checkCollisions(currentPos, rotatedShape);
    let blockMove = collisions.outsideGrid || collisions.merge;

    if (blockMove && currentPos.x <= 0) {
      const collisions = checkCollisions(add(currentPos, point(1, 0)), rotatedShape);
      blockMove = collisions.outsideGrid || collisions.merge;
      if (!blockMove) {
        position.x.value += 1;
      }
    }

    if (blockMove && currentPos.x === gridConfig.value.columns - 1) {
      const collisions = checkCollisions(add(currentPos, point(-1, 0)), rotatedShape);
      blockMove = collisions.outsideGrid || collisions.merge;
      if (!blockMove) {
        position.x.value -= 1;
      }
    }

    if (blockMove) return;
    tetromino.value = rotatedShape;
  });
  return (
    <GestureDetector gesture={Gesture.Race(tetrisPan, rotateTap)}>
      {children}
    </GestureDetector>
  );
};
