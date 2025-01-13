import * as Layer from 'effect/Layer';
import * as ManagedRuntime from 'effect/ManagedRuntime';
import { GameRepoContextLive } from './GameRepo.service';
import { GridRepoContextLive } from './GridStore.service';
import { PlayerContextLive } from './Player.service';

export const TetrisLayer = Layer.mergeAll(
  PlayerContextLive,
  GameRepoContextLive,
  GridRepoContextLive,
).pipe(Layer.provide(GridRepoContextLive));

export const TetrisRuntime = ManagedRuntime.make(TetrisLayer);
