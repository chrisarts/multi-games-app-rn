import { FlatList, StyleSheet } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { BoardControls } from "./components/BoardControls";
import { MoveDirection } from "../models";
import { useTetris } from "../hooks/useTetris";

export const TetrisBoard = () => {
  const { board, gameState, startGame, movePlayer, rotateShape } = useTetris();
  return (
    <FlatList
      scrollEnabled={false}
      data={board}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item: columns }) => (
        <FlatList
          scrollEnabled={false}
          data={columns}
          horizontal
          renderItem={({ item: cell }) => {
            return <TetrisCell cell={cell} />;
          }}
        />
      )}
      ListFooterComponent={() => (
        <BoardControls
          gameState={gameState}
          moveLeft={() =>
            movePlayer({ board, dir: MoveDirection.LEFT, value: -1 })
          }
          moveDown={() =>
            movePlayer({ board, dir: MoveDirection.DOWN, value: 1 })
          }
          moveRight={() =>
            movePlayer({ board, dir: MoveDirection.RIGHT, value: 1 })
          }
          rotate={() => rotateShape(board)}
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
