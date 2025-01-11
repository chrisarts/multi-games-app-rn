import { RoundedRect } from '@shopify/react-native-skia';
import * as Option from 'effect/Option';
import { useEffect, useSyncExternalStore } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import type { GridPosition } from '../../models/GridPosition.model';
import { tetrisContext } from '../../programs/game.program';

export const cellDefaultColor = 'rgba(131, 126, 126, 0.3)';

export const TetrisCellSvg = ({ point }: { point: GridPosition }) => {
  const props = useSyncExternalStore(
    tetrisContext.store.subscribe,
    () => tetrisContext.controls.getCellAt(point).pipe(Option.getOrThrow).store,
  );

  const isCurrentPosition = useSyncExternalStore(tetrisContext.store.subscribe, () => {
    const pos = tetrisContext.store.selectState((x) => x.player.dropPosition);
    return pos.id === point.id;
  });

  const animatedColor = useSharedValue(props.svg.color);

  useEffect(() => {
    animatedColor.value = withTiming(isCurrentPosition ? 'red' : props.svg.color, {
      duration: 100,
      easing: Easing.ease,
    });
  }, [props.svg.color, animatedColor, isCurrentPosition]);

  return <RoundedRect {...props.svg} color={animatedColor} />;
};

// interface TetrisShapeCellSvgProps {
//   position: SharedValue<BoardPosition>;
//   width: number;
//   height: number;
//   color: SharedValue<string>;
//   containerSize: number;
//   padding: number;
//   coords: BoardPosition;
// }
// export const TetrisShapeCellSvg = ({
//   coords,
//   color,
//   height,
//   width,
//   position,
//   containerSize,
//   padding,
// }: TetrisShapeCellSvgProps) => {
//   const coordinate = useDerivedValue(() => {
//     return {
//       x: (coords.y + position.value.y) * containerSize + padding / 2,
//       y: (coords.x + position.value.x) * containerSize + padding / 2,
//     };
//   });
//   const x = useDerivedValue(() => coordinate.value.x);
//   const y = useDerivedValue(() => coordinate.value.y);

//   return <RoundedRect x={x} y={y} width={width} height={height} color={color} r={5} />;
// };
