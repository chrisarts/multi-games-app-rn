import type { SharedValue } from 'react-native-reanimated';
import type { GridConfig, GridMatrix, GridSize, TetrisGrid } from './Grid.domain';
import type { AnimatedPosition } from './Position.domain';

export interface TetrisGameConfig {
  showHiddenCells: SharedValue<boolean>;
  size: SharedValue<GridSize>;
}
export interface TetrisGameState {
  running: SharedValue<boolean>;
  gameOver: SharedValue<boolean>;
  turbo: SharedValue<boolean>;
  lines: SharedValue<number>;
  level: SharedValue<number>;
  speed: SharedValue<number>;
  startTime: SharedValue<number>;
}

export interface TetrisBoardState {
  grid: SharedValue<GridMatrix>;
  gridConfig: SharedValue<GridConfig>;
  dropPosition: AnimatedPosition;
  lastTouchedX: SharedValue<number | null>;
  tetromino: {
    current: SharedValue<TetrisGrid>;
    next: SharedValue<TetrisGrid>;
  };
}
