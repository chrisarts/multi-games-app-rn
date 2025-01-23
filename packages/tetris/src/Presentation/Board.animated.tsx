import {
  Canvas,
  Fill,
  Group,
  Path,
  processTransform3d,
  rrect,
  usePathValue,
} from '@shopify/react-native-skia';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCellUIRect } from '../Domain/Grid.domain';
import { TetrisMatrixView } from './TetrisMatrix';
import { useAnimatedGame } from './hooks/useAnimatedGame';

export const AnimatedBoard = () => {
  const insets = useSafeAreaInsets();
  const { tetromino, grid, gestures } = useAnimatedGame();

  const skShapePath = usePathValue((skPath) => {
    'worklet';
    for (const cell of tetromino.currentShape.value.cells) {
      if (cell.value === 0) continue;
      skPath.addPath;
      skPath.addRRect(
        rrect(getCellUIRect(cell.point, grid.config.cellContainerSize), 5, 5),
      );
    }
    skPath.transform(
      processTransform3d([
        {
          translate: [
            tetromino.position.x.value * grid.config.cellContainerSize,
            tetromino.position.y.value * grid.config.cellContainerSize,
          ] as const,
        },
      ]),
    );
    return skPath;
  });

  const tetrominoColor = useDerivedValue(() => tetromino.currentShape.value.color);

  return (
    <GestureDetector gesture={Gesture.Race(gestures.rotate, gestures.moveX)}>
      <Canvas style={Dimensions.get('window')} debug>
        <Fill />
        {/* <Rect x={0} y={0} width={screen.width} height={screen.height}>
          <Shader source={TetrisShader} uniforms={uniforms} />
        </Rect> */}
        <Group transform={[{ translateY: grid.config.width / 2 - insets.top }]}>
          <TetrisMatrixView matrix={grid.matrix} config={grid.config} />
          <Path path={skShapePath} color={tetrominoColor} />
        </Group>
      </Canvas>
    </GestureDetector>
  );
};
