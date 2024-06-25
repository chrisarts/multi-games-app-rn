import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { useTetris } from "./useTetris";
import { MoveDirection } from "../models/Block.model";

export const TetrisBoard = () => {
  const { board, startGame, moveBlock } = useTetris();

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
            onPress={() => moveBlock(MoveDirection.LEFT)}
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
            onPress={() => moveBlock(MoveDirection.DOWN)}
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
            onPress={() => moveBlock(MoveDirection.RIGHT)}
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
            onPress={() => moveBlock(MoveDirection.ROTATE)}
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
