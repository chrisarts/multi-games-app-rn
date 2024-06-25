import { useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CellState, BoardCell } from "../../models/Board.model";

interface TetrisCellProps {
  cell: BoardCell;
}
export const TetrisCell = ({ cell }: TetrisCellProps) => {
  const { x, y, state, color } = cell;
  const point = useMemo(() => {
    return {
      text: `(${x},${y})`,
    };
  }, [x, y]);
  const cellColor = state === CellState.CLEAR ? "lightgray" : color;
  const textColor = state === CellState.CLEAR ? "black" : "white";
  return (
    <View
      style={[
        styles.cell,
        { backgroundColor: cellColor, borderColor: cellColor },
      ]}
    >
      <Text style={[styles.cellText, { color: textColor }]}>{point.text}</Text>
    </View>
  );
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
  cellText: {
    fontSize: 8,
  },
});
