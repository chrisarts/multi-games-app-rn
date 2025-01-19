import { Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import * as Cell from '../../../Domain/Cell.domain';
import type * as Grid from '../../../Domain/Grid.domain';
import type * as Position from '../../../Domain/Position.domain';
import { calculateUICellDraw } from '../../worklets/cell.worklet';

export const useAnimatedCell = (
  position: SkPoint,
  cellLayout: Grid.CellLayout,
) => {
  const cellRect = calculateUICellDraw(position, cellLayout);
  const cellObject: any = {
    id: `[${position.y},${position.x}]`,
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
  position: SkPoint,
  cellLayout: Grid.CellLayout,
) =>
  useMemo(() => {
    const para = Skia.ParagraphBuilder.Make()
      .addText(`${position.y}:${position.x}`)
      .pushStyle({
        color: Skia.Color('white'),
        backgroundColor: Skia.Color('red'),
      })
      .build();
    para.layout(cellLayout.size);
    return para;
  }, [position, cellLayout]);
