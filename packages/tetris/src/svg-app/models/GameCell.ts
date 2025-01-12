import * as Equal from 'effect/Equal';
import * as Hash from 'effect/Hash';
import * as Position from './internal/Position.typeclass';

export class GameCell implements Equal.Equal {
  constructor(
    readonly id: string,
    readonly position: Position.Position,
  ) {}

  [Equal.symbol](that: unknown): boolean {
    return that instanceof GameCell && Position.equals(this.position, that.position);
  }

  [Hash.symbol](): number {
    return Hash.string(this.id);
  }
}
