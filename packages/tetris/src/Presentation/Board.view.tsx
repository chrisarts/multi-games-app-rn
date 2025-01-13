import { StyleSheet, View } from 'react-native';
import { runForkedTetris } from '../Application/RunGame';
import { TetrisRuntime } from '../Services/Runtime.layers';
import { GridControls } from './GameControls.view';
import { GridView } from './GridSvg.view';
import { useRenderCounter } from './hooks/useRenderCounter';

TetrisRuntime.runFork(runForkedTetris);

export const GameBoardView = () => {
  useRenderCounter('GridView');

  return (
    <View style={styles.container}>
      <GridView />
      <GridControls />
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
