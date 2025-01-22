import type { SkPoint } from '@shopify/react-native-skia';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import type { SharedValue } from 'react-native-reanimated';
import type * as Grid from '../Domain/Grid.domain';

const make = Effect.gen(function* () {
  const drawShape = (
    matrix: Grid.TetrisAnimatedMatrix[][],
    shape: SharedValue<Grid.TetrisGrid>,
    position: SkPoint,
  ) => {
    'worklet';
    shape.value.matrix.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value > 0) {
          const cell = matrix[dy + position.y][dx + position.x];
          cell.color.value = shape.value.color;
          cell.value.value = value;
        }
      });
    });
  };
  
  return {
    drawShape,
  };
});
export interface TetrisContext extends Effect.Effect.Success<typeof make> {}
export const TetrisContext = Context.GenericTag<TetrisContext>('TetrisContext');
export const TetrisContextLive = Layer.effect(TetrisContext, make);
