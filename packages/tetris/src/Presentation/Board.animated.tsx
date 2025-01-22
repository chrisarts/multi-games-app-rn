import { Canvas, Fill, Group, Path } from '@shopify/react-native-skia';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TetrisMatrixView } from './TetrisMatrix';
import { useGame } from './hooks/useGame';

export const AnimatedBoard = () => {
  const { grid, tetromino, accelerate } = useGame();
  const insets = useSafeAreaInsets();

  return (
    <GestureDetector gesture={Gesture.Race(accelerate, grid.gesture, grid.tap)}>
      <Canvas style={Dimensions.get('window')} debug>
        <Fill />
        <Group transform={[{ translateY: grid.config.width / 2 - insets.top }]}>
          <TetrisMatrixView matrix={grid.matrix} config={grid.config} />
          <Path path={tetromino.skShapePath} color={tetromino.color} />
        </Group>
      </Canvas>
    </GestureDetector>
  );
};
