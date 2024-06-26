import { StyleSheet, View } from "react-native";
import { TetrisGame } from "@games/tetris";

export default function App() {
  return (
    <View style={styles.container}>
      <TetrisGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    // justifyContent: "center",
    // alignItems: "center",
  },
});
