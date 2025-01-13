import * as Brand from 'effect/Brand';
import type * as Position from './Position.domain';
import type * as Tetromino from './Tetromino.domain';

export interface GameState {
  gameStatus: GameRunState;
  dropPosition: Position.Position;
  nextTetromino: Tetromino.Tetromino;
  currentTetromino: Tetromino.Tetromino;
  speed: number;
}

export type GameRunState = ('InProgress' | 'GameOver' | 'Stop') &
  Brand.Brand<'GameRunState'>;

export const GameRunState = Brand.nominal<GameRunState>();

export const isRunning = (game: GameState) =>
  game.gameStatus === GameRunState('InProgress');
export const isGameOver = (game: GameState) =>
  game.gameStatus === GameRunState('GameOver');
