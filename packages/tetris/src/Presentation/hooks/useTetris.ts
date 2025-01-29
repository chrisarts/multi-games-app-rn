import {
  processTransform3d,
  rect,
  rrect,
  usePathValue,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { useGameState } from './useGameState';

export const useTetris = () => {
  const {
    actions,
    state: { board, game },
    player,
    fonts,
  } = useGameState();

  const tetrominoColor = useDerivedValue(() => player.tetromino.value.color);

  const skGhostShape = usePathValue((skPath) => {
    'worklet';
    const posY = board.getDistance(player.absPosition.value, player.tetromino.value);
    const cellSize = board.gridConfig.value.cell.size;
    for (const cell of player.tetromino.value.shape) {
      const cellR = rect(
        cell.x * cellSize,
        cell.y * cellSize,
        cellSize - 1,
        cellSize - 1,
      );
      skPath.addRRect(rrect(cellR, 5, 5));
    }

    skPath.transform(
      processTransform3d([
        {
          translate: [
            player.position.x.value * board.gridConfig.value.cell.size,
            posY * board.gridConfig.value.cell.size,
          ],
        },
      ]),
    );
  });

  const translateMainGrid = useDerivedValue(() => [
    {
      translate: [
        board.gridConfig.value.content.x,
        board.gridConfig.value.content.y,
      ] as const,
    },
  ]);

  return {
    tetrominoColor,
    actions,
    translateMainGrid,
    skGhostShape,
    board,
    player,
    game,
    fonts,
  };
};
