import { rect } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { TetrisBoardState, TetrisGameState } from '../../Domain/Tetris.domain';
import { playIconSvg } from '../icons/PlayIcon';

export const useGameControls = (game: TetrisGameState, board: TetrisBoardState) => {
  const playIconSvgValue = useDerivedValue(() =>
    game.running.value ? null : playIconSvg,
  );
  const playIconRect = useDerivedValue(() =>
    game.running.value
      ? rect(0, 0, 0, 0)
      : rect(
          board.gridConfig.value.screen.width / 2 -
            board.gridConfig.value.cell.size * 1.5,
          board.gridConfig.value.screen.height / 2,
          board.gridConfig.value.cell.size * 3,
          board.gridConfig.value.cell.size * 3,
        ),
  );

  return {
    platButton: {
      svg: playIconSvgValue,
      iconRect: playIconRect,
    },
  };
};
