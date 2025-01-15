import { ColorChannel, Skia } from '@shopify/react-native-skia';
import { HashMap } from 'effect';
import { useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import * as Cell from '../../Domain/Cell.domain';
import type * as Grid from '../../Domain/Grid.domain';
import type * as Position from '../../Domain/Position.domain';
import { GameStore } from '../../Store/Game.store';

export const useAnimatedCell = (
  position: Position.Position,
  cellLayout: Grid.CellLayout,
) => {
  const cellRect = Cell.calculateUICellDraw(position, cellLayout);
  const cellObject: Cell.CellGameObj = {
    id: `[${position.row},${position.column}]`,
    r: 5,
    x: useSharedValue(cellRect.x),
    y: useSharedValue(cellRect.y),
    color: Cell.defaultCellColor,
    mergeColor: useSharedValue(0),
    height: cellLayout.size,
    width: cellLayout.size,
  };

  return {
    cellObject,
    cellRect,
  };
};

export const useCellParagraph = (
  position: Position.Position,
  cellLayout: Grid.CellLayout,
) =>
  useMemo(() => {
    const para = Skia.ParagraphBuilder.Make()
      .addText(`${position.row}:${position.column}`)
      .pushStyle({
        color: Skia.Color('white'),
      })
      .build();
    para.layout(cellLayout.size);
    return para;
  }, [position, cellLayout]);
