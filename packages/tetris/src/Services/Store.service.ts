// import type { CustomStore } from '@games/shared';
// import * as Context from 'effect/Context';
// import * as Effect from 'effect/Effect';
// import * as Layer from 'effect/Layer';
// import * as Stream from 'effect/Stream';
// import type * as Game from '../Domain/Game.domain';
// import type * as Grid from '../Domain/Grid.domain';
// import { GameStore } from '../Store/Game.store';
// import { GridStore } from '../Store/Grid.store';
// import { listenForkedStreamChanges } from '../utils/effect.utils';

// export const make = Effect.gen(function* () {
//   const getGame = Effect.suspend(() => Effect.sync(() => GameStore.store));
//   const getGrid = Effect.suspend(() => Effect.sync(() => GridStore.store));

//   const gameStore = Effect.suspend(() =>
//     getGame.pipe(Effect.map((store) => createStoreStream(store, 'GameStore'))),
//   );
//   const gridStore = Effect.suspend(() =>
//     getGrid.pipe(Effect.map((store) => createStoreStream(store, 'GridStore'))),
//   );

//   const subscribeToGame = (f: <E>(state: Game.GameState) => Effect.Effect<void, E>) =>
//     Stream.unwrap(gameStore).pipe((stream) => listenForkedStreamChanges(stream, f));

//   const subscribeToGridState = (
//     f: <E>(state: Grid.GridState) => Effect.Effect<void, E>,
//   ) => Stream.unwrap(gridStore).pipe((stream) => listenForkedStreamChanges(stream, f));

//   return {
//     subscribeToGame,
//     subscribeToGridState,
//   };

//   function createStoreStream<V>(store: CustomStore<V>, name: string) {
//     return Stream.async<V>((emit) => {
//       const subscriber = store.subscribe((state) =>
//         Effect.runSync(Effect.sync(() => emit.single(state))),
//       );

//       return Effect.sync(() => subscriber()).pipe(
//         Effect.tap((r) => Effect.log(`Store Unsubscribed: ${name} - removed: ${r}`)),
//       );
//     });
//   }

//   // TODO: Set state from this fn
//   // function moveTo(move: Game.MoveDirection) {
//   //   const moveAction = gameBoard.getMoveAction(move);
//   //   const run = gameBoard.getActionExecution(moveAction);

//   //   console.log('RUN: ', run);
//   // }
// }).pipe(Effect.tap(() => Effect.log('Provided Store service ctx')));

// export interface StoreContext extends Effect.Effect.Success<typeof make> {}
// export const StoreContext = Context.GenericTag<StoreContext>('StoreContext');
// export const StoreContextLive = Layer.effect(StoreContext, make);
