import * as Sk from '@shopify/react-native-skia';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  runOnJS,
  useFrameCallback,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GRID } from '../Data/Grid.data';
import { GridDebugView, TetrominoCellsView } from './components/Grid.view';
import { useGame } from './hooks/useGameState';
import { inclusiveClamp } from './worklets/game.worklets';
import { checkCollisions } from './worklets/tetromino.worklet';

export const AnimatedBoard = () => {
  const insets = useSafeAreaInsets();
  const { dropPosition, shape, actions, game, grid } = useGame();

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;
    const tetromino = shape.current.value;

    const collisions = checkCollisions(
      {
        x: dropPosition.x.value,
        y: dropPosition.y.value,
      },
      shape.current,
    );

    if (collisions.wall.bottom && !shape.collided.value) {
      shape.collided.value = true;
      runOnJS(actions.onMergeTetromino)({
        color: tetromino.color,
        rects: tetromino.rects,
        bounds: tetromino.bounds,
        merged: true,
        vectors: tetromino.vectors,
        position: Sk.vec(dropPosition.x.value, dropPosition.y.value),
        skPath: tetromino.skPath,
      });
      dropPosition.y.value = withDelay(
        game.gameSpeed.value,
        withTiming(0, { duration: 1 }, (finished) => {
          if (finished) {
            shape.collided.value = false;
            shape.index.value = actions.getNextTetrominoIndex();
            dropPosition.y.value = 0;
          }
        }),
      );
    }

    if (!shape.collided.value && !collisions.wall.bottom) {
      const moveRate =
        GRID.cellSize / (game.gameSpeed.value / frame.timeSincePreviousFrame) / 2;
      dropPosition.y.value += moveRate;
    }
  });

  const gesture = Gesture.Pan()
    .onChange((e) => {
      dropPosition.x.value = inclusiveClamp(
        dropPosition.x.value + e.changeX,
        0,
        GRID.gridRect.width - shape.current.value.bounds.width,
      );
    })
    .maxPointers(1);

  return (
    <GestureDetector gesture={gesture}>
      <Sk.Canvas style={Dimensions.get('window')}>
        <Sk.Fill />
        <Sk.Group
          transform={[
            {
              translateY: GRID.gridRect.width / 2 - insets.top,
            },
          ]}
        >
          <GridDebugView color={grid.cellsColor} cells={grid.cells} />
          <Sk.Group>
            <Sk.Image
              image={shape.image}
              height={GRID.gridRect.height}
              width={GRID.gridRect.width}
              transform={shape.transform}
            />
          </Sk.Group>

          {grid.mergedShapes.map((merged, i) => (
            <Sk.Group
              key={`${merged.color}-${merged.rects.map((x) => `${x.x},${x.y}`).join('')}-${i}`}
              transform={[
                {
                  translate: [merged.position.x, merged.position.y],
                },
              ]}
            >
              <TetrominoCellsView color={merged.color} cells={merged.rects} />
            </Sk.Group>
          ))}
        </Sk.Group>
      </Sk.Canvas>
    </GestureDetector>
  );
};
