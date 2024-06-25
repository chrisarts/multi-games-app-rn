import { Text, View, StyleSheet } from "react-native";
import { BoardCell } from "../../models/Board.model";
import { BlockShapes } from "../../models/Block.model";
import { BoardPosition } from "../../models/Point.model";

interface TetrisCellProps {
  cell: BoardCell;
  position: BoardPosition;
}
export const TetrisCell = ({ cell, position }: TetrisCellProps) => {
  let cellColor = "lightgray";
  let textColor = "black";
  if (cell[0]) {
    cellColor = BlockShapes[cell[0]].color;
    textColor = "white";
  }

  return (
    <View
      style={[
        styles.cell,
        { backgroundColor: cellColor, borderColor: cellColor },
      ]}
    >
      <Text style={[styles.cellText, { color: textColor }]}>{cell}</Text>
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
