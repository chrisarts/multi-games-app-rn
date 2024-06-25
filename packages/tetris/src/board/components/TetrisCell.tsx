import { useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CellState, BoardCell } from "../../models/Board.model";
import { BlockShapes } from "../../models/Block.model";

interface TetrisCellProps {
  cell: BoardCell;
}
export const TetrisCell = ({ cell }: TetrisCellProps) => {
  const point = useMemo(() => {
    return {
      text: cell,
    };
  }, [cell]);
  let cellColor = "lightgray";
  let textColor = "black";
  if (cell === CellState.EMPTY) {
  } else {
    cellColor = BlockShapes[cell].color;
    textColor = "white";
  }
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
