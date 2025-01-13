import { type CustomStore, createStore } from '@games/shared';
import { Dimensions } from 'react-native';
import * as GameState from '../Domain/GameState.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';

export interface GameStore extends CustomStore<GameState.GameState> {}

export const GameStore: GameStore = createStore<GameState.GameState>({
  game: {
    speed: 800,
    status: 'Stop',
  },
  tetromino: {
    current: Tetromino.getRandomTetromino(),
    next: Tetromino.getRandomTetromino(),
    position: Position.zero(),
  },
  grid: GameState.makeGridState({
    screen: Dimensions.get('screen'),
    size: { rows: 15, columns: 10 },
  }),
});
