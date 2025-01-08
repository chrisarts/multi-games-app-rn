import { FlatList, StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useAnimatedTetris } from '../hooks/animated/useAnimatedTetris';
import { useBoardGestures } from '../hooks/useBoardGestures';
import { BoardControls } from './components/BoardControls';
import { BoardHeader } from './components/BoardHeader';
import { TetrisCell } from './components/TetrisCell';

export const TetrisBoard = () => {
  const tetris = useAnimatedTetris();
  const { gesture } = useBoardGestures(tetris, () => {});

  return (
    <View style={styles.container}>
      <BoardHeader gameState={tetris.status} nextShape={tetris.player.nextShapeBoard} />
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.listContainer}>
          <FlatList
            scrollEnabled={false}
            data={tetris.animatedBoard.value}
            renderItem={({ item: columns, index: rowIndex }) => (
              <View style={styles.rowContainer}>
                <FlatList
                  scrollEnabled={false}
                  data={columns}
                  horizontal
                  renderItem={({ item: cell, index: colIndex }) => (
                    <TetrisCell
                      cell={cell}
                      board={tetris.animatedBoard}
                      coords={{ column: colIndex, row: rowIndex }}
                    />
                  )}
                />
              </View>
            )}
          />
        </Animated.View>
      </GestureDetector>
      <BoardControls
        gameState={tetris.gameState}
        moveLeft={tetris.playerMovements.moveLeft}
        moveDown={tetris.playerMovements.moveDown}
        moveRight={tetris.playerMovements.moveRight}
        rotate={() => tetris.player.playerRotate(tetris.animatedBoard.value)}
        startGame={tetris.startGame}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    marginTop: 10,
  },
  rowContainer: { alignItems: 'center' },
});
