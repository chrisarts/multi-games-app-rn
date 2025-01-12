import * as Brand from 'effect/Brand';
import type * as GridBlock from '../models/GridBlock.model';
import type * as Position from './Position.domain';

export type GameRunState = ('InProgress' | 'GameOver' | 'Stop') &
  Brand.Brand<'GameRunState'>;

export const GameRunState = Brand.nominal<GameRunState>();

export interface GameState {
  gameStatus: GameRunState;
  dropPosition: Position.Position;
  droppingBlock: GridBlock.GridBlock;
}

export const isRunning = (game: GameState) =>
  game.gameStatus === GameRunState('InProgress');
export const isGameOver = (game: GameState) =>
  game.gameStatus === GameRunState('GameOver');
