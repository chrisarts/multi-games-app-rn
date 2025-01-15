import { getDeviceDimensions } from '@games/shared';
import * as Effect from 'effect/Effect';
import { StyleSheet, View } from 'react-native';
import { runForkedTetris } from '../Application/RunGame';
import { TetrisRuntime } from '../Services/Runtime.layers';
import { GameCanvas } from './GameCanvas';
import { GridControls } from './atoms/GameControls.view';
import { useRenderCounter } from './hooks/useRenderCounter';

TetrisRuntime.runFork(
  runForkedTetris.pipe(Effect.tap(() => Effect.log('Tetris stopped'))),
);

export const GameBoardView = () => {
  useRenderCounter('GridView');

  return (
    <View style={styles.container}>
      <GameCanvas />
      <GridControls />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    width: getDeviceDimensions().WIDTH,
  },
  listContainer: {
    marginTop: 10,
  },
  rowContainer: { alignItems: 'center' },
});
