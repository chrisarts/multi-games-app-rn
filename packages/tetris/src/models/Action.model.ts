import * as Brand from 'effect/Brand';
import * as Data from 'effect/Data';
import * as Match from 'effect/Match';
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

export type GameRunState = ('Play' | 'GameOver' | 'Stop') & Brand.Brand<'GameRunState'>;
export const GameRunState = Brand.nominal<GameRunState>();

export const getMoveDirectionUnit = Match.type<MoveDirection>().pipe(
  Match.when('zero', () => GridPosition.create({ x: 0, y: 0 })),
  Match.when('up', () => GridPosition.create({ x: -1, y: 0 })),
  Match.when('down', () => GridPosition.create({ x: 1, y: 0 })),
  Match.when('left', () => GridPosition.create({ x: 0, y: -1 })),
  Match.when('right', () => GridPosition.create({ x: 0, y: 1 })),
  Match.when('rotate', () => GridPosition.create({ x: 0, y: 0 })),
  Match.exhaustive,
);

export type PlayerAction = Data.TaggedEnum<{
  move: { direction: MoveDirection };
  runState: { status: GameRunState };
  setSpeed: { speed: keyof TickSpeed };
}>;

export const PlayerAction = Data.taggedEnum<PlayerAction>();

export type CollisionResult = Data.TaggedEnum<{
  LIMIT_REACHED: { gameOver: boolean; merge: boolean };
  MERGED_SIBLING: { sibling: GridCell; gameOver: boolean };
  CLEAR: { toPoint: GridPosition };
}>;

export const CollisionResult = Data.taggedEnum<CollisionResult>();
