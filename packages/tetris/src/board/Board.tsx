import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { useTetrisBoard } from "../hooks/useTetrisStore";
import { usePlayer } from "../hooks/usePlayer";
import { useInterval } from "../hooks/useInterval";
import { GameState } from "../models/Store.model";
import { hasCollisions } from "../utils";

export const TetrisBoard = () => {
  const { player, updatePlayerPosition, resetPlayer } = usePlayer();
  const { board, startGame, tickSpeed, gameState } = useTetrisBoard(
    player,
    resetPlayer
  );

  const drop = () => {
    if (
      !hasCollisions(board, player, {
        column: 0,
        row: 1,
      })
    ) {
      updatePlayerPosition({ column: 0, row: 1 }, false);
    } else {
      updatePlayerPosition({ column: 0, row: 0 }, true);
    }
  };

  const movePlayer = (dir: number) => {
    if (!hasCollisions(board, player, { row: dir, column: 0 })) {
      updatePlayerPosition({ row: dir, column: 0 }, false);
    }
  };

  useInterval(() => {
    if (gameState !== GameState.PLAYING) return;
    drop();
  }, tickSpeed);

  return (
    <FlatList
      scrollEnabled={false}
      data={board}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item: columns, index: x }) => (
        <FlatList
          scrollEnabled={false}
          data={columns}
          horizontal
          renderItem={({ item: cell, index: y }) => {
            return <TetrisCell position={{ column: y, row: x }} cell={cell} />;
          }}
        />
      )}
      ListFooterComponent={() => (
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={startGame}
            style={{
              margin: 5,
              padding: 5,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "white" }}>Start Game</Text>
          </Pressable>
          <Pressable
            // onPress={() => moveBlock(MoveDirection.LEFT)}
            style={{
              margin: 5,
              padding: 5,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "white" }}>Left</Text>
          </Pressable>
          <Pressable
            // onPress={() => moveBlock(MoveDirection.DOWN)}
            style={{
              margin: 5,
              padding: 5,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "white" }}>Down</Text>
          </Pressable>
          <Pressable
            // onPress={() => moveBlock(MoveDirection.RIGHT)}
            style={{
              margin: 5,
              padding: 5,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "white" }}>Right</Text>
          </Pressable>
          <Pressable
            onPress={() => movePlayer(1)}
            style={{
              margin: 5,
              padding: 5,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "white" }}>Rotate</Text>
          </Pressable>
        </View>
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
