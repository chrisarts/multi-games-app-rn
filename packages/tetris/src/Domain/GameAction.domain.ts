import type { SkPoint } from '@shopify/react-native-skia';
import * as Data from 'effect/Data';
import type * as GameState from './GameState.domain';

export type MoveDirection = 'up' | 'down' | 'left' | 'right' | 'rotate';
export type MoveAction = {
  direction: MoveDirection;
  unit: SkPoint;
};

const moveActionOf = (direction: MoveDirection, unit: SkPoint): MoveAction => ({
  direction,
  unit,
});

export type GameAction = Data.TaggedEnum<{
  move: MoveAction;
  statusChange: { state: GameState.GameRunState };
}>;

export const GameAction = Data.taggedEnum<GameAction>();

export const makeMove = {
  up: () => moveActionOf('up', { x: 0, y: -1 }),
  down: () => moveActionOf('down', { x: 0, y: 1 }),
  left: () => moveActionOf('left', { x: -1, y: 0 }),
  right: () => moveActionOf('right', { x: 1, y: 0 }),
  rotate: () => moveActionOf('rotate', { x: 0, y: 0 }),
};
