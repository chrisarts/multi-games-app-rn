import * as Effect from 'effect/Effect';
import * as Queue from 'effect/Queue';
import * as GameAction from '../Domain/GameAction.domain';
import { PlayerContext } from '../Services/Player.service';
import { TetrisRuntime } from '../Services/Runtime.layers';

export const publishPlayerAction = (action: GameAction.GameAction) =>
  TetrisRuntime.runPromise(
    Effect.andThen(PlayerContext, (ctx) => Queue.offer(ctx.playerActions, action)),
  );

const moveLeft = () =>
  publishPlayerAction(GameAction.GameAction.move({ to: GameAction.makeMove.left() }));

const moveRight = () =>
  publishPlayerAction(GameAction.GameAction.move({ to: GameAction.makeMove.right() }));

const moveDown = async () =>
  publishPlayerAction(GameAction.GameAction.move({ to: GameAction.makeMove.down() }));

const rotate = async () =>
  publishPlayerAction(
    GameAction.GameAction.move({ to: GameAction.makeMove.rotate() })
  );

const startGame = async () =>
  publishPlayerAction(GameAction.GameAction.statusChange({ state: 'InProgress' }));

export const runActionOnUI = {
  startGame,
  rotate,
  moveDown,
  moveRight,
  moveLeft,
};
