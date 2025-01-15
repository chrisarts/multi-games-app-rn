import * as Data from 'effect/Data';
import type * as GameState from './GameState.domain';
import * as Position from './Position.domain';

export type MoveAction = Data.TaggedEnum<{
  up: Position.Position;
  down: Position.Position;
  left: Position.Position;
  right: Position.Position;
  rotate: Position.Position;
}>;
export const MoveAction = Data.taggedEnum<MoveAction>();

export type GameAction = Data.TaggedEnum<{
  move: { to: MoveAction };
  statusChange: { state: GameState.GameRunState };
}>;

export const GameAction = Data.taggedEnum<GameAction>();

export const makeMove = {
  up: () => MoveAction.up(Position.of({ column: 0, row: -1 })),
  down: () => MoveAction.down(Position.of({ column: 0, row: 1 })),
  left: () => MoveAction.left(Position.of({ column: -1, row: 0 })),
  right: () => MoveAction.right(Position.of({ column: 1, row: 0 })),
  rotate: () => MoveAction.rotate(Position.of({ column: 0, row: 0 })),
};
