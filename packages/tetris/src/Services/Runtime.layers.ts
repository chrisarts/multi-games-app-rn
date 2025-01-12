import * as ManagedRuntime from 'effect/ManagedRuntime';
import { PlayerContext, PlayerContextLive } from './Player.service';

export const TetrisLayer = PlayerContextLive;

export const TetrisRuntime = ManagedRuntime.make(PlayerContextLive);
