import { add, point } from '@shopify/react-native-skia';
import { Gesture } from 'react-native-gesture-handler';
import type { createGridManager } from '../../Domain/Grid.domain';
import type {
  TetrisBoardState,
  TetrisGameState,
  TetrisPlayerState,
} from '../../Domain/Tetris.domain';
import { rotateTetromino } from '../../Domain/Tetromino.domain';

export const useGameGestures = (
  board: TetrisBoardState,
  player: TetrisPlayerState,
  game: TetrisGameState,
  gridManager: ReturnType<typeof createGridManager>,
  actions: {
    moveShapeXAxis: (sum: number, absoluteX: number) => void;
    startNewGame: () => void;
  },
) => {
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

    const collisions = gridManager.checkCollisions(currentPos, rotatedShape);
    let blockMove = collisions.outsideGrid || collisions.merge;

    if (blockMove && currentPos.x <= 0) {
      const collisions = gridManager.checkCollisions(
        add(currentPos, point(1, 0)),
        rotatedShape,
      );
      blockMove = collisions.outsideGrid || collisions.merge;
      if (!blockMove) {
        player.position.x.value += 1;
      }
    }

    if (blockMove && currentPos.x === board.gridConfig.value.columns - 1) {
      const collisions = gridManager.checkCollisions(
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

  return [tetrisPan, rotateTap];
};
