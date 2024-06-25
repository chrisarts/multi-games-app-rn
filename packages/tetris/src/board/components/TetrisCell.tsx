import { View, StyleSheet } from "react-native";
import { BoardCell } from "../../models";
import { getCellColors } from "../../utils/block.utils";

interface TetrisCellProps {
  cell: BoardCell;
}
export const TetrisCell = ({ cell }: TetrisCellProps) => {
  return <View style={[styles.cell, getCellColors(cell)]} />;
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
