import { RoundedRect } from '@shopify/react-native-skia';
import { Effect, Ref } from 'effect';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import type { GridPoint } from '../../models/GridCell.model';
import type { GameStateCtx } from '../../programs/services/GameState.service';

export const cellDefaultColor = 'rgba(131, 126, 126, 0.3)';

export const TetrisCellSvg = ({
  point,
  gameRef,
}: { point: GridPoint; gameRef: GameStateCtx['gameRef'] }) => {
  const gameStore = useMemo(
    () => Effect.runSync(gameRef.pipe(Effect.map((x) => x.state))),
    [gameRef],
  );

  const props = useSyncExternalStore(
    gameStore.subscribe,
    () => gameStore.getState().board.unsafePointToCell(point).store,
    () => gameStore.getState().board.unsafePointToCell(point).store,
  );

  const animatedColor = useSharedValue(props.svg.color);

  useEffect(() => {
    animatedColor.value = withTiming(props.svg.color, {
      duration: 100,
      easing: Easing.ease,
    });
  }, [props.svg.color, animatedColor]);

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
