import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { useTetrisBoard } from "../hooks/useTetrisBoard";
import { usePlayer } from "../hooks/usePlayer";
import { useInterval } from "../hooks/useInterval";
import { GameState, MoveDirection } from "../models";
import { hasCollisions } from "../utils";

export const TetrisBoard = () => {
  const { player, updatePlayerPosition, resetPlayer, movePlayer } = usePlayer();
  const { board, startGame, tickSpeed, gameState, setGameState, setTickSpeed } =
    useTetrisBoard(player, resetPlayer);

  const drop = () => {
    if (
      !hasCollisions(board, player, {
        column: 0,
        row: 1,
      })
    ) {
      updatePlayerPosition({ column: 0, row: 1 }, false);
    } else {
      if (player.position.row < 1) {
        console.log("GAME_OVER");
        setGameState(GameState.STOP);
        setTickSpeed(null);
      }
      updatePlayerPosition({ column: 0, row: 0 }, true);
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
            onPress={() =>
              movePlayer({ board, dir: MoveDirection.LEFT, value: -1 })
            }
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
            onPress={() =>
              movePlayer({ board, dir: MoveDirection.DOWN, value: 1 })
            }
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
            onPress={() =>
              movePlayer({ board, dir: MoveDirection.RIGHT, value: 1 })
            }
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
            onPress={() =>
              movePlayer({ board, dir: MoveDirection.ROTATE, value: 0 })
            }
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
