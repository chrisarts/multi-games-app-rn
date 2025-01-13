import type { CustomStore } from '@games/shared';
import * as Effect from 'effect/Effect';
import * as Ref from 'effect/Ref';
import * as Stream from 'effect/Stream';

export const createEffectStore = <State>(fromStore: CustomStore<State>) =>
  Effect.gen(function* () {
    const storeRef = yield* Ref.make<CustomStore<State>>(fromStore);

    const selector = <Out>(f: (state: State) => Out): Effect.Effect<Out> =>
      Ref.get(storeRef).pipe(Effect.map((x) => f(x.getState())));

    const unsafeSetState = (f: (state: State) => void): Effect.Effect<void> =>
      Effect.map(Ref.get(storeRef), (store) =>
        store.setState((x) => {
          f(x);
          return x;
        }),
      );

    const listenStateChanges = Effect.map(Ref.get(storeRef), (currentStore) =>
      Stream.async<State>((emit) => {
        const subscriber = currentStore.subscribe((nextState) =>
          Effect.runSync(Effect.sync(() => emit.single(nextState))),
        );

        return Effect.sync(() => subscriber()).pipe(
          Effect.tap((r) => Effect.log(`Store Unsubscribed - removed: ${r}`)),
        );
      }),
    );

    return {
      store: Ref.get(storeRef),
      selector,
      unsafeSetState,
      listenStateChanges,
    };
  });

// export interface StoreContext extends Effect.Effect.Success<typeof make> {}
// export const StoreContext = Context.GenericTag<StoreContext>('StoreContext');
// export const StoreContextLive = Layer.effect(StoreContext, make);
