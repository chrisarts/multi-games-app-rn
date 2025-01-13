import { type CustomStore, createStore } from '@games/shared';
import * as GameState from '../Domain/Game.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';

export interface GameStore extends  CustomStore<GameState.GameState> {}

export const GameStore: GameStore = createStore<GameState.GameState>({
  gameStatus: GameState.GameRunState('Stop'),
  currentTetromino: Tetromino.getRandomTetromino(),
  nextTetromino: Tetromino.getRandomTetromino(),
  dropPosition: Position.zero(),
  speed: 800,
});

