import { SafeAreaView, View, StyleSheet } from "react-native";
import { TetrisBoard } from "./board/Board";

export const TetrisGame = () =>{
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TetrisBoard />
      </View>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
