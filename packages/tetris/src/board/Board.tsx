import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { useTetris } from "./useTetris";

export const TetrisBoard = () => {
  const { board, startGame } = useTetris();
  //   const interval = setInterval(() => {
  //     console.log("POSITION: ", position);
  //     const collide = checkCollision(tetrisShape, board, position, {
  //       x: 0,
  //       y: 1,
  //     });
  //     if (collide) {
  //       clearInterval(interval);
  //     } else {
  //       setPosition((pos) => ({
  //         ...pos,
  //         x: pos.x,
  //         y: pos.y + 1,
  //       }));
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [position]);

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
