import * as HashMap from 'effect/HashMap';
import * as Option from 'effect/Option';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type * as Layout from '../Domain/Layout.domain';
import type * as Position from '../Domain/Position.domain';
import { useGridStore } from './hooks/useStore';

interface CellViewProps {
  position: Position.Position;
  cellLayout: Layout.CellLayout;
}

export const TetrisCell = ({ position, cellLayout }: CellViewProps) => {
  const cellState = useGridStore((selector) => HashMap.get(selector.cellsMap, position));

  const animatedStyles = useAnimatedStyle(() => {
    const square = cellLayout.size;
    const margin = cellLayout.spacing / 2;
    const borderRadius = cellLayout.spacing / 2;
    if (Option.isNone(cellState)) {
      return {
        backgroundColor: 'red',
        width: square,
        height: square,
      };
    }
    return {
      margin,
      width: square,
      height: square,
      borderRadius,
      backgroundColor: withTiming(cellState.value.animated.color.value, {
        duration: 10,
        easing: Easing.cubic,
        reduceMotion: ReduceMotion.System,
      }),
      // borderColor: withTiming(cellDefaultColor, {
      //   duration: 10,
      //   easing: Easing.in(Easing.linear),
      //   reduceMotion: ReduceMotion.System,
      // }),
    };
  });
  return <Animated.View style={[styles.cell, animatedStyles]} />;
};

const styles = StyleSheet.create({
  cell: {
    aspectRatio: 1,
    borderWidth: 0.3,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    borderRadius: 3,
  },
});
