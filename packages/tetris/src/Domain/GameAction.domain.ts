import * as Data from 'effect/Data';
import type * as GameState from './GameState.domain';
import * as Position from './Position.domain';

export type MoveDirection = 'up' | 'down' | 'left' | 'right' | 'rotate';
export type MoveAction = {
  direction: MoveDirection;
  unit: Position.Position;
};

const moveActionOf = (direction: MoveDirection, unit: Position.Position): MoveAction => ({
  direction,
  unit,
});

export type GameAction = Data.TaggedEnum<{
  move: MoveAction;
  statusChange: { state: GameState.GameRunState };
}>;

export const GameAction = Data.taggedEnum<GameAction>();

export const makeMove = {
  up: () => moveActionOf('up', Position.of({ column: 0, row: -1 })),
  down: () => moveActionOf('down', Position.of({ column: 0, row: 1 })),
  left: () => moveActionOf('left', Position.of({ column: -1, row: 0 })),
  right: () => moveActionOf('right', Position.of({ column: 1, row: 0 })),
  rotate: () => moveActionOf('rotate', Position.of({ column: 0, row: 0 })),
};
