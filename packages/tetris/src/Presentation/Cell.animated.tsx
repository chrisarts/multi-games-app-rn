import { RoundedRect } from '@shopify/react-native-skia';
import type { TetrisCell_ } from '../Domain/AnimatedTetris';

interface AnimatedTetrisCellProps {
  cell: TetrisCell_;
}

export const AnimatedTetrisCell = (props: AnimatedTetrisCellProps) => {
  return (
    <RoundedRect rect={props.cell.rRect} />
  )
};
