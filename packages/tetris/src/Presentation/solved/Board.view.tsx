import { getDeviceDimensions } from '@games/shared';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { runForkedTetris } from '../../Application/RunGame';
import { TetrisRuntime } from '../../Services/Runtime.layers';
import { GameCanvas } from './GameCanvas';
import { GridControls } from './GameControls.view';
import { useRenderCounter } from './hooks/useRenderCounter';
import { useGameStore } from './hooks/useStore';

export const GameBoardView = () => {
  useRenderCounter('GridView');
  const gameStatus = useGameStore((state) => state.game.status);
  useEffect(() => {
    if (gameStatus === 'InProgress' || gameStatus === 'Stop') {
      const fiber = TetrisRuntime.runFork(
        runForkedTetris.pipe(Effect.tap(() => Effect.log('Tetris stopped'))),
      );
      return () => {
        Effect.runPromise(Fiber.interrupt(fiber));
      };
    }
  }, [gameStatus]);

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
