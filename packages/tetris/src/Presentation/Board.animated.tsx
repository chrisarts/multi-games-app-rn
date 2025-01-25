import { Canvas, Fill, FitBox, Image, Path } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue } from 'react-native-reanimated';
import { useAnimatedGame } from './hooks/useAnimatedGame';
import { useTetrisGridPath } from './hooks/useTetrisGridPath';

export const AnimatedBoard = () => {
  const { tetromino, grid, gestures, dropPosition } = useAnimatedGame();
  const { skShapePath } = useTetrisGridPath(tetromino, dropPosition);
  const tetrominoColor = useDerivedValue(() => tetromino.value.color);

  // const t = useClock();
  // const uniforms = useDerivedValue(() => {
  //   return {
  //     iResolution: { x: screen.width, y: screen.height },
  //     iTime: t.value * 0.0005,
  //   };
  // });

  return (
    <GestureDetector gesture={Gesture.Race(gestures.rotate, gestures.moveX)}>
      <Canvas style={grid.config.screen} debug>
        <Fill />
        {/* <Rect x={0} y={0} width={screen.width} height={screen.height}>
          <Shader source={TetrisShader} uniforms={uniforms} />
          </Rect> */}
        {/* <Rect
          rect={grid.clip}
          style='stroke'
          color='white'
          strokeWidth={grid.config.cellSpacing * 2}
          transform={[
            { translate: [0, grid.config.gridPosition.y] },
          ]}
        /> */}
        <FitBox
          src={{
            x: 0,
            y: 0,
            height: grid.config.height,
            width: grid.config.width,
          }}
          dst={{
            ...grid.config.gridPosition,
            height: grid.config.height,
            width: grid.config.width * 0.9,
          }}
          fit='contain'
        >
          <Path path={skShapePath} color={tetrominoColor} />
          <Image
            image={grid.mergedGrid.image}
            width={grid.config.width}
            height={grid.config.height}
          />
        </FitBox>
        {/* <Group
          transform={[
            { translate: [grid.config.gridPosition.x, grid.config.gridPosition.y] },
          ]}
        >
          <Path path={skShapePath} color={tetrominoColor} />
          <Image
            image={grid.mergedGrid.image}
            width={grid.config.width}
            height={grid.config.height}
          />
        </Group> */}
      </Canvas>
    </GestureDetector>
  );
};
