import { GestureDetector } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { pre } from '@effect/schema/FastCheck';
import { getDeviceDimensions } from '@games/shared';
import {
  Canvas,
  Fill,
  Group,
  Mask,
  Path,
  Points,
  Skia,
  SkPoint,
  SweepGradient,
  useVectorInterpolation,
  vec,
} from '@shopify/react-native-skia';
import { pipe } from 'effect';
import * as ReadOnlyArray from 'effect/Array';
import { useAnimatedTetris } from '../hooks/useAnimatedTetris';
import { useBoardGestures } from '../hooks/useBoardGestures';
import { BlockShape, BlockShapes } from '../models';
import { TetrisCellSvg } from './SVG/CellSvg';
import { BoardControls } from './components/BoardControls';
import { BoardHeader } from './components/BoardHeader';

const shapeToVectors = (shape: BlockShape['shape']) => {
  // const path = Skia.Path.Make();
  const cartesian = pipe(shape, ReadOnlyArray.cartesian(shape));
  console.log('cartesian: ', cartesian);
  const vectors = pipe(
    shape,
    ReadOnlyArray.map((rows, y) => {
      return ReadOnlyArray.map(rows, (_, x) => ({ x: x, y: y }));
    }),
  );

  return vectors;
};
// test(BlockShapes.I.shape);

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
  const gestures = useBoardGestures(tetris, () => {});

  return (
    <View style={styles.container}>
      <BoardHeader gameState={tetris.status} nextShape={tetris.player.nextShapeBoard} />
      <GestureDetector gesture={gestures.gesture}>
        <Canvas style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }} mode='continuous'>
          {tetris.animatedBoard.value.map((rows, rowIndex) =>
            rows.map((_, colIndex) => (
              <TetrisCellSvg
                key={`cell-${rowIndex}-${colIndex}`}
                board={tetris.animatedBoard}
                coords={{ column: colIndex, row: rowIndex }}
                width={SQUARE_SIZE}
                height={SQUARE_SIZE}
                x={colIndex * SQUARE_CONTAINER_SIZE + PADDING / 2}
                y={rowIndex * SQUARE_CONTAINER_SIZE + PADDING / 2}
              />
            )),
          )}
          {/* <Points
          points={points}
          mode='polygon'
          color='green'
          style='fill'
          strokeWidth={2}
        /> */}

          {/* <Points
          points={shape}
          mode='lines'
          color='lightblue'
          style='fill'
          strokeWidth={2}
          strokeJoin='round'
          strokeCap='square'
        /> */}
          {/* <Path path={path} color='white' strokeWidth={2} style='fill' /> */}
          {/* <Points
          points={points}
          mode='points'
          color='lightblue'
          style='stroke'
          strokeWidth={4}
        /> */}
          {/* <DroppingShape
          containerSize={SQUARE_CONTAINER_SIZE}
          size={SQUARE_SIZE}
          padding={PADDING}
          position={tetris.player.position}
          shape={tetris.player.currentShape}
        /> */}
        </Canvas>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    marginTop: 10,
  },
  rowContainer: { alignItems: 'center' },
});
