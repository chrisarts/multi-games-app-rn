import * as Sk from '@shopify/react-native-skia';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useFrameCallback } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCellUIRect } from '../Domain/Grid.domain';
import { checkCollisions } from '../Domain/Tetromino.domain';
import { inclusiveClamp } from '../utils/animation.utils';
import { TetrisGridCell, TetrisGridView } from './TetrisGrid.view';
import { useCurrentShape } from './hooks/useCurrentShape';
import { useGrid } from './hooks/useGrid';

export const AnimatedBoard = () => {
  const grid = useGrid();
  const shape = useCurrentShape(grid.gridConfig);
  const insets = useSafeAreaInsets();

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;

    const collisions = checkCollisions(
      {
        x: shape.translateX.value,
        y: shape.translateY.value,
      },
      shape.currentShape,
      grid.gridConfig,
    );
    if (collisions.wall.bottom) {
      console.log(
        'COLLIDED: ',
        JSON.stringify(
          {
            pos: collisions.shapePos,
            coords: collisions.shapeCoords,
            wall: collisions.wall,
            gridSize: grid.gridConfig.cellContainerSize * grid.gridConfig.rows,
          },
          null,
          2,
        ),
        '\n\n',
      );
    }
    if (collisions.wall.bottom && !shape.collided.value) {
      shape.collided.value = true;

      const nextShape =
        shape.allTetrominos[Math.floor(Math.random() * shape.allTetrominos.length)];

      shape.translateY.value = 0;
      shape.translateX.value = 0;
      shape.currentShape.value = nextShape;
      shape.collided.value = false;
    }

    if (!shape.collided.value && !collisions.wall.bottom) {
      const moveRate =
        grid.gridConfig.cellContainerSize /
        (shape.speed.value / frame.timeSincePreviousFrame);
      shape.translateY.value += moveRate;
    }
  });

  const tetrominoSkPath = useDerivedValue(() => {
    const skPath = Sk.Skia.Path.Make();
    const cells = shape.currentShape.value.vectors.map((vector) =>
      getCellUIRect(vector, grid.gridConfig.cellContainerSize),
    );
    for (const cell of cells) {
      skPath.addRRect(Sk.rrect(cell, 5, 5));
    }
    return skPath;
  });

  const currentTetrominoColor = useDerivedValue(() => shape.currentShape.value.color);

  const gesture = Gesture.Pan()
    .onChange((e) => {
      console.log('Y', e.absoluteY);
      shape.translateX.value = inclusiveClamp(
        shape.translateX.value + e.changeX,
        0,
        grid.gridConfig.width -
          Sk.bounds(
            shape.currentShape.value.vectors.map((x) =>
              getCellUIRect(x, grid.gridConfig.cellContainerSize),
            ),
          ).width,
      );
    })
    .maxPointers(1);

  const tetrisGrid = useDerivedValue(() => grid.tetrisGrid);

  return (
    <GestureDetector gesture={gesture}>
      <Sk.Canvas style={Dimensions.get('window')}>
        <Sk.Fill />
        <Sk.Group
          transform={[{ translateY: grid.gridConfig.width / 2 - insets.top }]}
          invertClip
        >
          <TetrisGridView grid={tetrisGrid} config={grid.gridConfig} />
          {grid.tetrisGridCells.map(({ color, coords, rect }) => (
            <TetrisGridCell
              key={`gridCell-${coords.x}:${coords.y}`}
              rect={rect}
              cellSize={grid.gridConfig.cellContainerSize}
              color={color}
            />
          ))}
          <Sk.Path
            path={tetrominoSkPath}
            color={currentTetrominoColor}
            transform={shape.transform}
          />
        </Sk.Group>
      </Sk.Canvas>
    </GestureDetector>
  );
};
