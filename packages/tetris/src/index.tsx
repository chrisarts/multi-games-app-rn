import { StyleSheet, View } from 'react-native';
import { AnimatedBoard } from './Presentation/Board.animated';
import { GameBoardView } from './Presentation/solved/Board.view';

export const TetrisGame = () => {
  return (
    <View style={styles.container}>
      {/* <GameBoardView /> */}
      <AnimatedBoard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
