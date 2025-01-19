import * as Sk from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import * as Grid from '../../Domain/Grid.domain';
import { getAllTetrominos, getRandomTetromino } from '../worklets/tetromino.worklet';

export const useGame = () => {
  const screen = useWindowDimensions();
  const gridConfig = useMemo(
    () => Grid.getGridConfig(screen.width, { rows: 15, columns: 10 }),
    [screen],
  );
  const tetrisGrid = useMemo(
    () => Grid.getGridLayout(gridConfig, gridConfig),
    [gridConfig],
  );
  const allTetrominos = useMemo(
    () => getAllTetrominos(gridConfig, gridConfig.cellSize + 1),
    [gridConfig],
  );
  const mergedTetrominos = useSharedValue<Grid.TetrisGrid[]>([]);

  const gridPath = useSharedValue(Grid.createGridUIPath(tetrisGrid.cells));
  const mergedPath = useSharedValue(Sk.Skia.Path.Make());
  const collided = useSharedValue(false);
  const gameSpeed = useSharedValue(800);
  const dropPositionX = useSharedValue(0);
  const dropPositionY = useSharedValue(0);

  const textureIndex = useSharedValue(Math.floor(Math.random() * allTetrominos.length));

  const currentTetromino = useSharedValue(
    getRandomTetromino(gridConfig, gridConfig.cellSize + 1),
  );

  const currentShapeTransform = useDerivedValue(() => {
    return [
      {
        translate: [dropPositionX.value, dropPositionY.value] as const,
      },
    ];
  });

  const getNextTetrominoIndex = () => {
    'worklet';
    const nextIdx = Math.floor(Math.random() * allTetrominos.length);
    if (nextIdx === textureIndex.get()) {
      return Math.floor(Math.random() * allTetrominos.length);
    }
    return nextIdx;
  };

  return {
    dropPosition: {
      x: dropPositionX,
      y: dropPositionY,
    },
    grid: {
      mergedShapes: mergedTetrominos,
      mergedPath,
      gridPath,
      gridConfig,
      tetrisGrid,
    },
    shape: {
      allTetrominos,
      index: textureIndex,
      current: currentTetromino,
      transform: currentShapeTransform,
      collided,
    },
    game: {
      gameSpeed,
    },
    actions: {
      getNextTetrominoIndex,
    },
  };
};
