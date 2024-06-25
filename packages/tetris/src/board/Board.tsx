import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { useTetris } from "./useTetris";

export const TetrisBoard = () => {
  const { board, startGame } = useTetris();

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
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={startGame}
            style={{
              margin: 20,
              padding: 5,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "white" }}>Start Game</Text>
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
