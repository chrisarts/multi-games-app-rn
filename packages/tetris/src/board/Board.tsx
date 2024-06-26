import { FlatList, StyleSheet, View } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { BoardControls } from "./components/BoardControls";
import { MoveDirection } from "../models";
import { useAnimatedTetris } from "../hooks/useAnimatedTetris";
import { BoardHeader } from "./components/BoardHeader";

export const TetrisBoard = () => {
  const { gameState, startGame, animatedBoard, status, position } =
    useAnimatedTetris();

  return (
    <View>
      <View style={{ flex: 1, flexGrow: 10, justifyContent: "flex-end" }}>
        <BoardHeader gameState={status} nextShape={position.nextShapeBoard} />
      </View>
      <View style={{ flex: 1, flexGrow: 80 }}>
        <FlatList
          scrollEnabled={false}
          data={animatedBoard.value}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item: columns, index: rowIndex }) => (
            <FlatList
              scrollEnabled={false}
              data={columns}
              horizontal
              renderItem={({ item: cell, index: colIndex }) => {
                return (
                  <TetrisCell
                    cell={cell}
                    board={animatedBoard}
                    coords={{ column: colIndex, row: rowIndex }}
                  />
                );
              }}
            />
          )}
        />
      </View>
      <View style={{ flex: 1, flexGrow: 10, justifyContent: "flex-end" }}>
        <BoardControls
          gameState={gameState}
          moveLeft={() =>
            position.movePosition({
              board: animatedBoard.value,
              dir: MoveDirection.LEFT,
              value: -1,
            })
          }
          moveDown={() =>
            position.movePosition({
              board: animatedBoard.value,
              dir: MoveDirection.DOWN,
              value: 1,
            })
          }
          moveRight={() =>
            position.movePosition({
              board: animatedBoard.value,
              dir: MoveDirection.RIGHT,
              value: 1,
            })
          }
          rotate={() => position.playerRotate(animatedBoard.value)}
          startGame={startGame}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
