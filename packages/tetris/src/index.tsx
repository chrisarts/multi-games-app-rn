import { SafeAreaView, View, StyleSheet } from 'react-native';
import { CanvasBoard } from './board/CanvasBoard';

export const TetrisGame = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CanvasBoard />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
