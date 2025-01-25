import { RoundedRect, rect, rrect } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { TetrisBoardState } from '../Domain/Tetris.domain';

interface SquareInfoProps {
  board: TetrisBoardState;
  index: number;
}
export const SquareInfo = ({ board, index }: SquareInfoProps) => {
  const squareInfoRect = useDerivedValue(() => {
    const original = board.gridConfig.value.infoSquareRect;
    const currentX = original.width * index + original.x;
    return rrect(
      rect(
        currentX,
        original.y,
        original.width - original.x,
        original.height - original.x,
      ),
      5,
      5,
    );
  });

  return (
    <RoundedRect rect={squareInfoRect} strokeWidth={3} style='stroke' color='lightGray' />
  );
};
