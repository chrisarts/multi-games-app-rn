import { Canvas } from '@shopify/react-native-skia';
import * as HashSet from 'effect/HashSet';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTetrisGrid } from '../hooks/useTetrisGrid';
import { MoveDirection } from '../models/Block.model';
import { TetrisCellSvg } from './SVG/CellSvg';
import { BoardControls } from './components/BoardControls';

export const CanvasBoard = () => {
  const { gridPoints, gridModel, actions, gameState, gameStore, gameHandler } =
    useTetrisGrid();

  const gridCells = useMemo(
    () =>
      HashSet.map(gridPoints, (gridPoint) => (
        <TetrisCellSvg
          key={gridPoint.id}
          point={gridPoint}
          gameRef={gameHandler.game.gameRef}
        />
      )),
    [gridPoints, gameHandler],
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
        gameState={gameState}
        moveLeft={() => actions.move(MoveDirection.LEFT)}
        moveDown={() => actions.move(MoveDirection.DOWN)}
        moveRight={() => actions.move(MoveDirection.RIGHT)}
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
