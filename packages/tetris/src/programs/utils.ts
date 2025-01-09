import { keysOf } from '@games/shared';
import { Effect, Random, Tuple } from 'effect';
import { Block, type BlockShape, BlockShapes } from '../models/Block.model';
import { getBlockShape } from '../utils';

const blocks = keysOf(BlockShapes);

export const getRandomBlock: Effect.Effect<[Block, BlockShape]> = Random.choice(
  blocks,
).pipe(
  Effect.map((block) => Tuple.make(block, getBlockShape(block))),
  Effect.catchAll(() => Effect.succeed(Tuple.make(Block.T, getBlockShape(Block.T)))),
);
