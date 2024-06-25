import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
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
  },
});
