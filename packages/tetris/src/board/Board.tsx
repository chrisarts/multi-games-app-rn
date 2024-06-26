import { FlatList, StyleSheet } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { BoardControls } from "./components/BoardControls";
import { MoveDirection } from "../models";
import { useAnimatedTetris } from "../hooks/useAnimatedTetris";

export const TetrisBoard = () => {
  const { gameState, startGame, animatedBoard, movePosition, playerRotate } =
    useAnimatedTetris();

  return (
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
      // ListHeaderComponent={() => <BoardHeader gameState={status} />}
      ListFooterComponent={() => (
        <BoardControls
          gameState={gameState}
          moveLeft={() =>
            movePosition({
              board: animatedBoard.value,
              dir: MoveDirection.LEFT,
              value: -1,
            })
          }
          moveDown={() =>
            movePosition({
              board: animatedBoard.value,
              dir: MoveDirection.DOWN,
              value: 1,
            })
          }
          moveRight={() =>
            movePosition({
              board: animatedBoard.value,
              dir: MoveDirection.RIGHT,
              value: 1,
            })
          }
          rotate={() => playerRotate(animatedBoard.value)}
          startGame={startGame}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
