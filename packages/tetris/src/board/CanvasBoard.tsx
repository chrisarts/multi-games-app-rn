import { StyleSheet, View } from 'react-native';
import { getDeviceDimensions } from '@games/shared';
import { Canvas } from '@shopify/react-native-skia';
import { useAnimatedTetris } from '../hooks/useAnimatedTetris';
import { TetrisCellSvg } from './SVG/CellSvg';
import { DroppingShape } from './SVG/DroppingShapeScg';
import { BoardControls } from './components/BoardControls';

const { WIDTH: SCREEN_WIDTH } = getDeviceDimensions();

const SQUARES_HORIZONTAL = 10;
const SQUARES_VERTICAL = 15;

const PADDING = 3;
const SQUARE_CONTAINER_SIZE = SCREEN_WIDTH / SQUARES_HORIZONTAL;
const SQUARE_SIZE = SQUARE_CONTAINER_SIZE - PADDING;

const CANVAS_WIDTH = SCREEN_WIDTH;
const CANVAS_HEIGHT = SQUARES_VERTICAL * SQUARE_CONTAINER_SIZE;

export const CanvasBoard = () => {
  const tetris = useAnimatedTetris();

  return (
    <View style={styles.container}>
      <Canvas style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }} mode='continuous'>
        {tetris.animatedBoard.value.map((rows, rowIndex) => {
          return rows.map((column, colIndex) => {
            return (
              <TetrisCellSvg
                key={`cell-${rowIndex}-${colIndex}`}
                board={tetris.animatedBoard}
                coords={{ column: colIndex, row: rowIndex }}
                width={SQUARE_SIZE}
                height={SQUARE_SIZE}
                x={colIndex * SQUARE_CONTAINER_SIZE + PADDING / 2}
                y={rowIndex * SQUARE_CONTAINER_SIZE + PADDING / 2}
              />
            );
          });
        })}
        <DroppingShape
          containerSize={SQUARE_CONTAINER_SIZE}
          size={SQUARE_SIZE}
          padding={PADDING}
          position={tetris.player.position}
          shape={tetris.player.currentShape}
        />
        {/* {tetris.player.currentShape.value.shape.map((row, rowIndex) => {
          return row.map((col, colIndex) => {
            if (col !== 0) {
              return (
                <TetrisShapeCellSvg
                  key={`shape-${rowIndex}-${colIndex}`}
                  height={SQUARE_SIZE}
                  width={SQUARE_SIZE}
                  coords={{ column: colIndex, row: rowIndex }}
                  shape={tetris.player.currentShape}
                  // y={
                  //   (rowIndex + position.row) * SQUARE_CONTAINER_SIZE +
                  //   PADDING / 2
                  // }
                  // x={
                  //   (colIndex + position.column) * SQUARE_CONTAINER_SIZE +
                  //   PADDING / 2
                  // }
                  position={tetris.player.position}
                  containerSize={SQUARE_CONTAINER_SIZE}
                  padding={PADDING}
                />
              );
            }
          });
        })} */}
      </Canvas>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    marginTop: 10,
  },
  rowContainer: { alignItems: 'center' },
});
