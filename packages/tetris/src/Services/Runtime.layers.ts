import * as Layer from 'effect/Layer';
import * as ManagedRuntime from 'effect/ManagedRuntime';
import * as GameAction from '../Domain/GameAction.domain';
import * as Position from '../Domain/Position.domain';
import { GameRepoContextLive } from './GameRepo.service';
import { PlayerContextLive } from './Player.service';

export const TetrisLayer = Layer.mergeAll(
  PlayerContextLive,
  GameRepoContextLive,
);

export const TetrisRuntime = ManagedRuntime.make(TetrisLayer);
