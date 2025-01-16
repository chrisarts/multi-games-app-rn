import { StyleSheet, View } from 'react-native';
import { GameBoardView } from './Presentation/solved/Board.view';

export const TetrisGame = () => {
  return (
    <View style={styles.container}>
      <GameBoardView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
