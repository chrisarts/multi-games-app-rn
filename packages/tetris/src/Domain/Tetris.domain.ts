import type { SharedValue } from 'react-native-reanimated';
import type { GridConfig, GridMatrix, GridSize } from './Grid.domain';
import type { AnimatedPosition } from './Position.domain';
import type { Tetromino, TetrominosBag } from './Tetromino.domain';

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

export interface TetrisPlayerState {
  position: AnimatedPosition;
  tetromino: SharedValue<Tetromino>;
  bag: TetrominosBag;
  lastTouchedX: SharedValue<number | null>;
}

export interface TetrisBoardState {
  grid: SharedValue<GridMatrix>;
  gridConfig: SharedValue<GridConfig>;
}
