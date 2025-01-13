import { Inspectable, type Pipeable } from 'effect';
import { pipeArguments } from 'effect/Pipeable';

export const TypeId: unique symbol = Symbol.for('react/EffectStore');
export type TypeId = typeof TypeId;

export interface EffectStore<A> extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly [TypeId]: TypeId;
  readonly keepAlive: boolean;
  readonly read: EffectStore.Read<A>;
  readonly label?: readonly [name: string, stack: string]
}

export interface Context {
  <A>(store: EffectStore<A>): A;
  readonly get: <A>(store: EffectStore<A>) => A;
}

export declare namespace EffectStore {
  export type Read<A> = (ctx: Context) => A;

  export type ReadFn<Arg, A> = (arg: Arg, ctx: Context) => A;
}

const EffectStoreProto = {
  [TypeId]: TypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON(this: EffectStore<any>) {
    return {
      _id: 'EffectStore',
      keepAlive: this.keepAlive,
      label: 'this.',
    };
  },
  toString() {
    return Inspectable.format(this);
  },
  [Inspectable.NodeInspectSymbol](this: EffectStore<any>) {
    return this.toJSON();
  },
} as const;

const EffectStoreRuntimeProto = {
  ...EffectStoreProto,
  store(this: any) {},
};
