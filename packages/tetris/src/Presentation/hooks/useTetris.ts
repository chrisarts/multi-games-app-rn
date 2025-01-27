import { add, point } from '@shopify/react-native-skia';
import { Easing, useFrameCallback, withTiming } from 'react-native-reanimated';
import { useGameGestures } from './useGameGestures';
import { useGameState } from './useGameState';

export const useTetris = () => {
  const {
    actions,
    state: { board, game, player },
    fonts,
    gridManager,
    gridSkImage,
  } = useGameState();
  const gestures = useGameGestures(board, player, game, gridManager, actions);

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

      const collision = gridManager.checkCollisions(nextPos, player.tetromino.value);

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
    gestures,
    board,
    player,
    gridManager,
    game,
    gridSkImage,
    fonts,
  };
};
