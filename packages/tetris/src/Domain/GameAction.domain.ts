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
  up: () => moveActionOf('up', Position.of({ x: 0, y: -1 })),
  down: () => moveActionOf('down', Position.of({ x: 0, y: 1 })),
  left: () => moveActionOf('left', Position.of({ x: -1, y: 0 })),
  right: () => moveActionOf('right', Position.of({ x: 1, y: 0 })),
  rotate: () => moveActionOf('rotate', Position.of({ x: 0, y: 0 })),
};
