import * as Sk from '@shopify/react-native-skia';
import { useState } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { GRID } from '../../Data/Grid.data';
import * as Grid from '../../Domain/Grid.domain';
import type * as Tetromino from '../../Domain/Tetromino.domain';
import { tetrominoTextures } from '../worklets/textures.worklet';

export const useGame = () => {
  const [mergedTetrominos, setMergedTetrominos] = useState<Tetromino.UITetromino[]>([]);

  const gridPath = useSharedValue(Grid.createCanvasUIPath());
  const mergedPath = useSharedValue(Sk.Skia.Path.Make());
  const collided = useSharedValue(false);
  const gameSpeed = useSharedValue(800);
  const dropPositionX = useSharedValue(0);
  const dropPositionY = useSharedValue(0);

  const textureIndex = useSharedValue(
    Math.floor(Math.random() * tetrominoTextures.length),
  );

  const currentTetromino = useDerivedValue(() => tetrominoTextures[textureIndex.value]);
  const currentTetrominoImage = useDerivedValue(() => currentTetromino.value.texture);

  const currentShapeTransform = useDerivedValue(() => {
    return [
      {
        translate: [dropPositionX.value, dropPositionY.value] as const,
      },
    ];
  });

  const cellsColor = useSharedValue(Grid.defaultCellColor);
  const gridCells = useSharedValue(GRID.cells);

  const getNextTetrominoIndex = () => {
    'worklet';
    const nextIdx = Math.floor(Math.random() * tetrominoTextures.length);
    if (nextIdx === textureIndex.get()) {
      return Math.floor(Math.random() * tetrominoTextures.length);
    }
    return nextIdx;
  };

  const onMergeTetromino = (tetromino: Tetromino.UITetromino) => {
    setMergedTetrominos((p) => [...p, tetromino]);
  };

  return {
    dropPosition: {
      x: dropPositionX,
      y: dropPositionY,
    },
    grid: {
      cellsColor,
      cells: gridCells,
      mergedShapes: mergedTetrominos,
      mergedPath,
      gridPath,
    },
    shape: {
      index: textureIndex,
      image: currentTetrominoImage,
      current: currentTetromino,
      transform: currentShapeTransform,
      collided,
    },
    game: {
      gameSpeed,
    },
    actions: {
      getNextTetrominoIndex,
      onMergeTetromino,
    },
  };
};
