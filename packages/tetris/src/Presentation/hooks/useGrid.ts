import type { SkImage } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import * as Grid from '../../Domain/Grid.domain';

export const useGrid = () => {
  const screen = useWindowDimensions();
  const gridConfig = Grid.getGridConfig(screen.width, { rows: 15, columns: 10 });
  const tetrisGrid = Grid.getGridLayout(gridConfig, gridConfig);
  const mergedTetrominos = useSharedValue<Grid.TetrisGrid[]>([]);
  const mergedShapesTexture = useSharedValue<SkImage | null>(null);

  const tetrisGridCells = tetrisGrid.vectors.map((vector) => ({
    color: useSharedValue(tetrisGrid.color),
    rect: Grid.getCellUIRect(vector, gridConfig.cellContainerSize),
    coords: vector,
  }));

  return {
    screen,
    gridConfig,
    // gridPath,
    tetrisGrid,
    mergedTetrominos,
    mergedShapesTexture,
    tetrisGridCells,
  };
};
