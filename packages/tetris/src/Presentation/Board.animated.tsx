import * as Sk from '@shopify/react-native-skia';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useFrameCallback } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TetrisMatrixView } from './TetrisMatrix';
import { useGame } from './hooks/useGame';

export const AnimatedBoard = () => {
  const { gameState, grid, tetromino, actions } = useGame();
  const insets = useSafeAreaInsets();

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;
    const elapsed = Date.now() - gameState.startTime.value;
    const toSpeed = gameState.turboActive.value ? 100 : gameState.speed.value;

    if (elapsed > toSpeed) {
      const nextPosition = {
        x: tetromino.position.x.value,
        y: tetromino.position.y.value + 1,
      };

      if (actions.isValidPosition(nextPosition, tetromino.shape.value.matrix)) {
        actions.moveTetromino(nextPosition);
      } else {
        gameState.turboActive.value = false;
        actions.mergeShape();
      }
      gameState.startTime.value = Date.now();
    }
  });

  const gesture = Gesture.Pan()
    .onChange((e) => {
      const posX = Math.floor(
        e.x -
          (tetromino.skPath.value.getBounds().width + grid.config.cellContainerSize) / 2,
      );
      const moveTo = Math.floor(posX / grid.config.cellContainerSize);

      const calcMove = Math.floor(
        (Math.ceil(e.velocityX / e.changeX) / grid.config.midX) % grid.config.columns,
      );

      // console.log('CALC_MOVE: ', {
      //   changeX: Math.ceil(e.changeX),
      //   calcMove,
      //   translationX: Math.round(e.translationX),
      // });

      if (
        Number.isInteger(tetromino.position.y.value) &&
        moveTo !== tetromino.position.x.value
      ) {
        actions.moveTetromino({ x: moveTo, y: tetromino.position.y.value });
      }
    })
    .minDistance(grid.config.cellContainerSize * 1.5)
    .failOffsetY(grid.config.cellContainerSize / 2)
    .maxPointers(1);

  const accelerate = Gesture.Pan()
    .onChange((e) => {
      if (e.changeY > 0) {
        gameState.turboActive.value = true;
      } else {
        gameState.turboActive.value = false;
      }
    })
    .minDistance(grid.config.cellContainerSize * 2)
    .activeOffsetY(grid.config.cellContainerSize * 2)
    .failOffsetX(grid.config.cellContainerSize / 2)
    .maxPointers(1);

  const tap = Gesture.Tap().onEnd((e) => {
    actions.rotateTetromino();
  });

  return (
    <GestureDetector gesture={Gesture.Race(accelerate, gesture, tap)}>
      <Sk.Canvas style={Dimensions.get('window')} debug>
        <Sk.Fill />
        <Sk.Group transform={[{ translateY: grid.config.width / 2 - insets.top }]}>
          <Sk.Group
            clip={Sk.rect(
              0,
              0,
              grid.config.width,
              grid.config.cellContainerSize * grid.config.rows,
            )}
          >
            <TetrisMatrixView matrix={grid.matrix} config={grid.config} />
            <Sk.Path
              path={tetromino.skPath}
              color={tetromino.color}
              // transform={shape.transform}
            />
          </Sk.Group>
        </Sk.Group>
      </Sk.Canvas>
    </GestureDetector>
  );
};
