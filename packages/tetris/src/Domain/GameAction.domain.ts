import * as Data from 'effect/Data';
import * as Position from './Position.domain';

export type MoveAction = Data.TaggedEnum<{
  up: Position.Position;
  down: Position.Position;
  left: Position.Position;
  right: Position.Position;
}>;
export const MoveAction = Data.taggedEnum<MoveAction>();

export type GameAction = Data.TaggedEnum<{
  move: { to: MoveAction };
  rotate: { to: MoveAction };
}>;

export const GameAction = Data.taggedEnum<GameAction>();

export const makeMove = {
  up: () => MoveAction.up(Position.of({ column: 0, row: -1 })),
  down: () => MoveAction.up(Position.of({ column: 0, row: 1 })),
  left: () => MoveAction.up(Position.of({ column: -1, row: 0 })),
  right: () => MoveAction.up(Position.of({ column: 0, row: 1 })),
};
