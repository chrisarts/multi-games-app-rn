import { type SkImage, type SkPoint, rect } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { GridMatrix, TetrisGrid } from '../../Domain/Grid.domain';
import { createGridManager } from '../../Domain/Tetromino.domain';
import { useGameContext } from '../context/GameContext';

export const useTetrisGrid = () => {
  const { gridConfig, tetrisGrid } = useGameContext();
  const gridMatrix = useSharedValue<GridMatrix>(tetrisGrid.cellsMatrix);
  const image = useSharedValue<SkImage | null>(null);
  const swipedLines = useSharedValue(0);
  const gridClip = rect(
    gridConfig.cell.size * 2,
    gridConfig.cell.size * -1,
    gridConfig.screen.width - gridConfig.cell.size * 5,
    gridConfig.size.height + gridConfig.cell.size * 2,
  );

  const gridManager = createGridManager(gridMatrix);

  const checkCollisions = (at: SkPoint, shape: TetrisGrid) => {
    'worklet';
    return gridManager.checkCollisions(at, shape);
  };

  const addMergedTetromino = (tetromino: TetrisGrid) => {
    'worklet';
    gridManager.mergeTetromino(tetromino);

    image.value = gridManager.draw(gridConfig);
  };

  useEffect(() => {
    image.value = gridManager.draw(gridConfig);
  }, [gridConfig, gridManager, image]);

  return {
    gridMatrix,
    checkCollisions,
    gridClip,
    mergedGrid: {
      image,
      addMergedTetromino,
      swipedLines,
    },
  };
};
