import { StyleSheet } from "react-native";
import { BoardCell, BoardMatrix, BoardPosition } from "../../models";
import { getBlockShape } from "../../utils/block.utils";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

interface TetrisCellProps {
  cell: BoardCell;
  board: SharedValue<BoardMatrix>;
  coords: BoardPosition;
}
export const TetrisCell = ({ cell, board, coords }: TetrisCellProps) => {
  const value = useDerivedValue(() => {
    return board.value[coords.row][coords.column];
  });
  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor:
        value.value[0] === null ? "gray" : getBlockShape(value.value[0]).color,
    };
  });
  return <Animated.View style={[styles.cell, animatedStyles]} />;
};

const styles = StyleSheet.create({
  cell: {
    aspectRatio: 1,
    width: 30,
    height: 30,
    borderColor: "white",
    borderWidth: 1,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 0.5,
    borderRadius: 3,
  },
});
