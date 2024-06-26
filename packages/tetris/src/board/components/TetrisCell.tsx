import { StyleSheet } from "react-native";
import { BoardCell, BoardMatrix, BoardPosition } from "../../models";
import { getBlockShape } from "../../utils/block.utils";
import Animated, {
  Easing,
  ReduceMotion,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

interface TetrisCellProps {
  cell: BoardCell;
  board: SharedValue<BoardMatrix>;
  coords: BoardPosition;
}

const cellDefaultColor = "rgba(131, 126, 126, 0.3)";

export const TetrisCell = ({ cell, board, coords }: TetrisCellProps) => {
  const value = useDerivedValue(() => {
    return board.value[coords.row][coords.column];
  });
  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        value.value[0] === null
          ? cellDefaultColor
          : getBlockShape(value.value[0]).color,
        {
          duration: 100,
          easing: Easing.cubic,
          reduceMotion: ReduceMotion.System,
        }
      ),
      borderColor: withTiming(
        value.value[0] === null
          ? cellDefaultColor
          : getBlockShape(value.value[0]).color,
        {
          duration: 200,
          easing: Easing.in(Easing.linear),
          reduceMotion: ReduceMotion.System,
        }
      ),
    };
  });
  return <Animated.View style={[styles.cell, animatedStyles]} />;
};

const styles = StyleSheet.create({
  cell: {
    aspectRatio: 1,
    width: 30,
    height: 30,
    borderColor: cellDefaultColor,
    borderWidth: 0.3,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
    borderRadius: 3,
  },
});
