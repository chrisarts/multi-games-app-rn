import {
  type SkImage,
  Skia,
  processTransform3d,
  rrect,
} from '@shopify/react-native-skia';
import { useSharedValue } from 'react-native-reanimated';
import { type TetrisGrid, getCellUIRect } from '../../Domain/Grid.domain';
import { useGameContext } from '../context/GameContext';

export const useMergedTetrominos = () => {
  const { gridConfig } = useGameContext();
  const mergedTetrominos = useSharedValue<TetrisGrid[]>([]);
  const image = useSharedValue<SkImage | null>(null);

  const addMergedTetromino = (tetromino: TetrisGrid) => {
    'worklet';
    mergedTetrominos.set((prev) => {
      prev.push(tetromino);
      return prev;
    });

    const surface = Skia.Surface.Make(gridConfig.width, gridConfig.height);
    // if (!surface) return null;
    const canvas = surface?.getCanvas();
    if (!canvas || !surface) return null;

    for (const shape of mergedTetrominos.value) {
      const skPath = Skia.Path.Make();

      for (const cell of shape.cellsMatrix.flat()) {
        if (cell.value === 0) continue;
        skPath.addRRect(rrect(getCellUIRect(cell.point, gridConfig.cell.size), 5, 5));
      }
      skPath.transform(
        processTransform3d([
          {
            translate: [
              shape.position.x * gridConfig.cell.size,
              shape.position.y * gridConfig.cell.size,
            ],
          },
        ]),
      );
      const paint = Skia.Paint();
      paint.setColor(Skia.Color(shape.color));
      canvas.drawPath(skPath, paint);
    }
    surface.flush();

    image.value = surface.makeImageSnapshot();
  };

  return {
    image,
    addMergedTetromino,
    mergedTetrominos,
  };
};
