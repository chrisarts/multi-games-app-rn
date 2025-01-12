import * as Brand from 'effect/Brand';
import * as Data from 'effect/Data';
import * as Match from 'effect/Match';
import type * as Option from 'effect/Option';
import type { GameRunState } from '../Domain/Game.domain';
import type { GridCell } from './GridCell.model';
import { GridPosition } from './GridPosition.model';

const validMoves = ['zero', 'left', 'right', 'up', 'down', 'rotate'];
export type MoveDirection = ('zero' | 'left' | 'right' | 'up' | 'down' | 'rotate') &
  Brand.Brand<'MoveDirection'>;

export const MoveDirection = Brand.refined<MoveDirection>(
  (x) => validMoves.includes(x),
  (x) => Brand.error('invalid Move', x),
);

export const TickSpeed = {
  Normal: 800,
  Sliding: 200,
};
export type TickSpeed = typeof TickSpeed;

export const getMoveDirectionUnit = Match.type<MoveDirection>().pipe(
  Match.when('zero', () => GridPosition.create({ row: 0, column: 0 })),
  Match.when('up', () => GridPosition.create({ row: -1, column: 0 })),
  Match.when('down', () => GridPosition.create({ row: 1, column: 0 })),
  Match.when('left', () => GridPosition.create({ row: 0, column: -1 })),
  Match.when('right', () => GridPosition.create({ row: 0, column: 1 })),
  Match.when('rotate', () => GridPosition.create({ row: 0, column: 0 })),
  Match.exhaustive,
);

export interface GridPositionBounds {
  right: number;
  left: number;
  up: number;
  down: number;
}

export interface PlayerMoveResult {
  direction: MoveDirection;
  move: {
    from: GridPosition;
    to: GridPosition;
  };
  blockPosition: {
    from: GridPosition[];
    to: GridPosition[];
  };
}

export type PlayerAction = Data.TaggedEnum<{
  move: { direction: MoveDirection };
  runState: { status: GameRunState };
  setSpeed: { speed: keyof TickSpeed };
}>;

export const PlayerAction = Data.taggedEnum<PlayerAction>();

export interface PlayerActionExecution {
  moveTo: Option.Option<GridPosition>;
  mergeBlock: boolean;
  gameOver: boolean;
  clearRows: number[];
}

export type CollisionResult = Data.TaggedEnum<{
  LIMIT_REACHED: { gameOver: boolean; merge: boolean };
  MERGED_SIBLING: { sibling: GridCell; gameOver: boolean; merge: boolean };
  CLEAR: { toPoint: GridPosition };
}>;

export const CollisionResult = Data.taggedEnum<CollisionResult>();
