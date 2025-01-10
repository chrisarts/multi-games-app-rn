import * as Data from 'effect/Data';
import type { GameState, TickSpeed } from './Board.model';
import type { GridCell } from './GridCell.model';
import type { GridPosition } from './GridPosition.model';

export type MoveDirection = 'left' | 'right' | 'up' | 'down' | 'rotate';
export type PlayerAction = Data.TaggedEnum<{
  move: { direction: MoveDirection; };
  runState: { status: GameState };
  setSpeed: { speed: TickSpeed };
}>;

export const PlayerAction = Data.taggedEnum<PlayerAction>();

export type CollisionResult = Data.TaggedEnum<{
  LIMIT_REACHED: { gameOver: boolean; merge: boolean };
  MERGED_SIBLING: { sibling: GridCell; gameOver: boolean };
  CLEAR: { toPoint: GridPosition };
}>;

export const CollisionResult = Data.taggedEnum<CollisionResult>();
