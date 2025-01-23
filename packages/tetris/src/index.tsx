import { StyleSheet, View } from 'react-native';
import { AnimatedBoard } from './Presentation/Board.animated';
import { GameContextProvider } from './Presentation/context/GameContext';

export const TetrisGame = () => {
  return (
    <View style={styles.container}>
      <GameContextProvider>
        <AnimatedBoard />
      </GameContextProvider>
      {/* <GameBoardView /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
