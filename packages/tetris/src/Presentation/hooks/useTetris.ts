import { add, point } from '@shopify/react-native-skia';
import { Gesture } from 'react-native-gesture-handler';
import { Easing, useFrameCallback, withTiming } from 'react-native-reanimated';
import { rotateTetromino } from '../../Domain/Tetromino.domain';
import { useGameState } from './useGameState';

export const useTetris = () => {
  const {
    actions,
    state: { board, game, dropPosition },
    player,
    ghostShapeSkPath,
    fonts,
  } = useGameState();

  const tetrisPan = Gesture.Pan()
    .onBegin((e) => {
      player.lastTouchedX.value = e.absoluteX;
    })
    .onChange((e) => {
      if (!player.lastTouchedX.value) return;

      if (Math.abs(e.translationY) > board.gridConfig.value.cell.size * 2) {
        game.turbo.value = e.translationY > 0;
        return;
      }

      const minMoveX = board.gridConfig.value.cell.size * 0.5;
      if (Math.abs(e.absoluteX - player.lastTouchedX.value) > minMoveX) {
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
    const rotatedShape = rotateTetromino(player.tetromino.value);
    const currentPos = point(player.position.x.value, player.position.y.value);

    const collisions = board.checkCollisions(currentPos, rotatedShape);
    let blockMove = collisions.outsideGrid || collisions.merge;

    if (blockMove && currentPos.x <= 0) {
      const collisions = board.checkCollisions(
        add(currentPos, point(1, 0)),
        rotatedShape,
      );
      blockMove = collisions.outsideGrid || collisions.merge;
      if (!blockMove) {
        player.position.x.value += 1;
      }
    }

    if (blockMove && currentPos.x === board.gridConfig.value.columns - 1) {
      const collisions = board.checkCollisions(
        add(currentPos, point(-1, 0)),
        rotatedShape,
      );
      blockMove = collisions.outsideGrid || collisions.merge;
      if (!blockMove) {
        player.position.x.value -= 1;
      }
    }

    if (blockMove) return;
    player.tetromino.value = rotatedShape;
  });

  // const ghostShapePath = usePathValue((skPath) => {
  //   'worklet';
  //   const finalPoint = point(dropPosition.value.x, dropPosition.value.y);
  //   const cellConfig = board.gridConfig.value.cell;
  //   for (const cell of player.tetromino.value.shape) {
  //     skPath.addRRect(
  //       rrect(
  //         rect(
  //           cell.x * cellConfig.size,
  //           cell.y * cellConfig.size,
  //           cellConfig.size - 1,
  //           cellConfig.size - 1,
  //         ),
  //         5,
  //         5,
  //       ),
  //     );
  //   }
  //   skPath.transform(
  //     processTransform3d([
  //       {
  //         translate: [
  //           finalPoint.x * board.gridConfig.value.cell.size,
  //           finalPoint.y * board.gridConfig.value.cell.size,
  //         ] as const,
  //       },
  //     ]),
  //   );
  //   return skPath;
  // });

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;
    const elapsed = Date.now() - game.startTime.value;
    const toSpeed = game.turbo.value ? 100 : game.speed.value;

    if (elapsed > toSpeed) {
      game.startTime.value = Date.now();
      if (!game.running.value || game.gameOver.value) return;

      const nextPos = add(
        point(player.position.x.value, player.position.y.value),
        point(0, 1),
      );

      const collision = board.checkCollisions(nextPos, player.tetromino.value);

      if (!collision.merge && !collision.outsideGrid) {
        player.position.y.value = withTiming(nextPos.y, {
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
      }
    }
  });

  return {
    gestures: [tetrisPan, rotateTap],
    dropPosition,
    ghostShapeSkPath,
    board,
    player,
    game,
    fonts,
  };
};
