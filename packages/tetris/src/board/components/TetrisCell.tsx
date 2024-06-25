import { useSyncExternalStore } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CellState, BoardCell } from "../../models/Board.model";
import { BlockShapes } from "../../models/Block.model";
import { registerCell, store } from "../../models/Store.model";
import { BoardPosition } from "../../models/Point.model";

interface TetrisCellProps {
  cell: BoardCell;
  position: BoardPosition;
}
export const TetrisCell = ({ cell, position }: TetrisCellProps) => {
  console.log("POSITION: ", position);
  // const state = useSyncExternalStore(
  //   store.subscribe,
  //   () => registerCell(position, cell),
  //   () => registerCell(position, cell)
  // );
  let cellColor = "lightgray";
  let textColor = "black";
  if (cell !== CellState.EMPTY) {
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
