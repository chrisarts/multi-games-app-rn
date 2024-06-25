import { View, StyleSheet } from "react-native";
import { BoardCell } from "../../models/Board.model";
import { BlockShapes } from "../../models/Block.model";
import { BoardPosition } from "../../models/Point.model";

interface TetrisCellProps {
  cell: BoardCell;
  position: BoardPosition;
}
export const TetrisCell = ({ cell }: TetrisCellProps) => {
  let cellColor = "lightgray";
  if (cell[0]) {
    cellColor = BlockShapes[cell[0]].color;
  }

  return (
    <View
      style={[
        styles.cell,
        { backgroundColor: cellColor, borderColor: cellColor },
      ]}
    />
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
});
