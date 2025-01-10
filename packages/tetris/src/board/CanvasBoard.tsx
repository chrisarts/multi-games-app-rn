import { Canvas } from '@shopify/react-native-skia';
import * as HashSet from 'effect/HashSet';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTetrisStore } from '../hooks/useTetrisStore';
import { MoveDirection } from '../models/Action.model';
import { TetrisCellSvg } from './SVG/CellSvg';
import { BoardControls } from './components/BoardControls';

export const CanvasBoard = () => {
  const { gridPoints, canvasSize, actions, gameState } = useTetrisStore();

  const gridCells = useMemo(
    () =>
      HashSet.map(gridPoints, (gridPoint) => (
        <TetrisCellSvg key={gridPoint.id} point={gridPoint} />
      )),
    [gridPoints],
  );

  return (
    <View style={styles.container}>
      {/* <BoardHeader gameState={tetris.status} nextShape={newBoard} /> */}
      {/* <GestureDetector gesture={gestures.gesture}> */}
      <Canvas style={canvasSize} mode='continuous'>
        {gridCells}
      </Canvas>
      {/* </GestureDetector> */}
      <BoardControls
        gameState={gameState}
        moveLeft={() => actions.move('left')}
        moveDown={() => actions.move('down')}
        moveRight={() => actions.move('right')}
        rotate={() => actions.rotate()}
        startGame={actions.startGame}
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
