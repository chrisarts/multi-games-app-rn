import { add, point } from '@shopify/react-native-skia';
import { Gesture } from 'react-native-gesture-handler';
import { Easing, useFrameCallback, withTiming } from 'react-native-reanimated';
import { rotateTetromino } from '../../Domain/Tetromino.domain';
import { useGameState } from './useGameState';

export const useTetris = () => {
  const {
    actions,
    state: { board, game },
    gridManager,
    gridSkImage,
  } = useGameState();
 

  const tetrisPan = Gesture.Pan()
    .onBegin((e) => {
      board.lastTouchedX.value = e.absoluteX;
    })
    .onChange((e) => {
      if (!board.lastTouchedX.value) return;

      if (Math.abs(e.translationY) > board.gridConfig.value.cell.size * 2) {
        game.turbo.value = e.translationY > 0;
        return;
      }

      const minMoveX = board.gridConfig.value.cell.size * 0.5;
      if (Math.abs(e.absoluteX - board.lastTouchedX.value) > minMoveX) {
        actions.moveShapeXAxis(e.velocityX > 0 ? 1 : -1, e.absoluteX);
      }
    })
    .minDistance(board.gridConfig.value.cell.size * 0.5)
    .maxPointers(1);

  const rotateTap = Gesture.Tap().onTouchesUp(() => {
    if (!game.running.value) {
      actions.startNewGame();
      return;
    }
    const rotatedShape = rotateTetromino(board.tetromino.current.value);
    const currentPos = point(board.dropPosition.x.value, board.dropPosition.y.value);

    const collisions = gridManager.checkCollisions(currentPos, rotatedShape);
    let blockMove = collisions.outsideGrid || collisions.merge;

    if (blockMove && currentPos.x <= 0) {
      const collisions = gridManager.checkCollisions(
        add(currentPos, point(1, 0)),
        rotatedShape,
      );
      blockMove = collisions.outsideGrid || collisions.merge;
      if (!blockMove) {
        board.dropPosition.x.value += 1;
      }
    }

    if (blockMove && currentPos.x === board.gridConfig.value.columns - 1) {
      const collisions = gridManager.checkCollisions(
        add(currentPos, point(-1, 0)),
        rotatedShape,
      );
      blockMove = collisions.outsideGrid || collisions.merge;
      if (!blockMove) {
        board.dropPosition.x.value -= 1;
      }
    }

    if (blockMove) return;
    board.tetromino.current.value = rotatedShape;
  });

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;
    const elapsed = Date.now() - game.startTime.value;
    const toSpeed = game.turbo.value ? 100 : game.speed.value;

    if (elapsed > toSpeed) {
      game.startTime.value = Date.now();
      if (!game.running.value || game.gameOver.value) return;

      const nextPos = add(
        point(board.dropPosition.x.value, board.dropPosition.y.value),
        point(0, 1),
      );

      const collision = gridManager.checkCollisions(
        nextPos,
        board.tetromino.current.value,
      );

      if (!collision.merge && !collision.outsideGrid) {
        board.dropPosition.y.value = withTiming(nextPos.y, {
          duration: 100,
          easing: Easing.linear,
        });
      }

      if (collision.merge) {
        if (collision.at.y <= 1) {
          actions.onGameOver();
          return;
        }

        actions.mergeCurrentTetromino();

        const nextCollision = gridManager.checkCollisions(
          point(0, 0),
          board.tetromino.next.value,
        );
        if (nextCollision.merge && nextCollision.at.y < 1) {
          actions.onGameOver();
          return;
        }
        // tetromino.resetPosition();
        actions.swapShapes();
      }
    }
  });

  return {
    gestures: [tetrisPan, rotateTap],
    board,
    gridManager,
    game,
    gridSkImage,
  };
};
