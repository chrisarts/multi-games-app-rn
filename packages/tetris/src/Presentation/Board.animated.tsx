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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCellUIRect } from '../Domain/Grid.domain';
import { TetrisMatrixView } from './TetrisMatrix';
import { useAnimatedGame } from './hooks/useAnimatedGame';

export const AnimatedBoard = () => {
  const insets = useSafeAreaInsets();
  const { tetromino, grid, position } = useAnimatedGame();

  const skShapePath = usePathValue((skPath) => {
    'worklet';
    for (const cell of tetromino.cells.value) {
      if (cell.value === 0) continue;
      skPath.addPath;
      skPath.addRRect(
        rrect(getCellUIRect(cell.point, grid.gridConfig.cellContainerSize), 5, 5),
      );
    }
    skPath.transform(
      processTransform3d([
        {
          translate: [
            position.x.value * grid.gridConfig.cellContainerSize,
            position.y.value * grid.gridConfig.cellContainerSize,
          ] as const,
        },
      ]),
    );
    return skPath;
  });

  return (
    <GestureDetector gesture={Gesture.Pan()}>
      <Canvas style={Dimensions.get('window')} debug>
        <Fill />
        <Group transform={[{ translateY: grid.gridConfig.width / 2 - insets.top }]}>
          <TetrisMatrixView matrix={grid.matrix} config={grid.gridConfig} />
          <Path path={skShapePath} color={tetromino.color} />
        </Group>
      </Canvas>
    </GestureDetector>
  );
};
