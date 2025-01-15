import { SafeAreaView, StyleSheet } from 'react-native';
import { GameBoardView } from './Presentation/Board.view';

export const TetrisGame = () => {
  return (
    <SafeAreaView style={styles.container}>
      <GameBoardView />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
