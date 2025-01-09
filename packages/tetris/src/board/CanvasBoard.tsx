import { Canvas } from '@shopify/react-native-skia';
import * as Order from 'effect/Order';
import * as SortedSet from 'effect/SortedSet';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTetrisGrid } from '../hooks/useTetrisGrid';
import { GameState } from '../models/Board.model';
import { TetrisCellSvg } from './SVG/CellSvg';
import { BoardControls } from './components/BoardControls';

export const CanvasBoard = () => {
  const { grid, gridModel, actions } = useTetrisGrid();

  const gridCells = useMemo(
    () =>
      SortedSet.map(grid, Order.empty(), (cell) => (
        <TetrisCellSvg key={cell.id} point={cell} gridModel={gridModel} />
      )),
    [grid, gridModel],
  );

  return (
    <View style={styles.container}>
      {/* <BoardHeader gameState={tetris.status} nextShape={newBoard} /> */}
      {/* <GestureDetector gesture={gestures.gesture}> */}
      <Canvas
        style={{
          width: gridModel.layout.canvas.width,
          height: gridModel.layout.canvas.height,
        }}
        mode='continuous'
      >
        {gridCells}
      </Canvas>
      {/* </GestureDetector> */}
      <BoardControls
        gameState={GameState.STOP}
        moveLeft={() => {}}
        moveDown={() => {}}
        moveRight={() => {}}
        rotate={() => {}}
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
