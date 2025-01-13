import { SafeAreaView, StyleSheet } from 'react-native';
import { GameBoardView } from './Presentation/Board.view';

export const TetrisGame = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GameBoardView />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
