import type { SharedValue } from 'react-native-reanimated';

export interface AnimatedPosition {
  x: SharedValue<number>;
  y: SharedValue<number>;
}

export interface GridCoordinates {
  column: number;
  row: number;
}
