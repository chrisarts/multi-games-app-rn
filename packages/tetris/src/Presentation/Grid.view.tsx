import { Array, Effect } from 'effect';
import * as HashSet from 'effect/HashSet';
import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { GameContext, GameContextLive } from '../Services/Game.service';
import { TetrisRuntime } from '../Services/Runtime.layers';
import { GridStore } from '../Store/Grid.store';
import { CellView } from './Cell.view';
import { GridControls } from './GridControls';
import { useRenderCounter } from './hooks/useRenderCounter';

TetrisRuntime.runFork(
  GameContext.pipe(
    Effect.tap((ctx) => Effect.log('START', ctx.onAction)),
    Effect.provide(GameContextLive),
  ),
);

export const GridView = () => {
  useRenderCounter('GridView');
  const boardCells = GridStore.useGrisStore((state) => state.positions);
  const layout = GridStore.useGrisStore((state) => state.layout);

  const cells = useMemo(() => Array.fromIterable(boardCells), [boardCells]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={cells}
        numColumns={layout.size.columns}
        renderItem={({ item }) => (
          <CellView
            key={`${item.row}-${item.column}`}
            cellLayout={layout.cell}
            position={item}
          />
        )}
      />
      <GridControls />
    </View>
  );
};
