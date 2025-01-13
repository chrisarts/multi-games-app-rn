import * as Array from 'effect/Array';
import * as Effect from 'effect/Effect';
import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import * as Position from '../Domain/Position.domain';
import { GameContext, GameContextLive } from '../Services/Game.service';
import { TetrisRuntime } from '../Services/Runtime.layers';
import { CellView } from './Cell.view';
import { GridControls } from './GridControls';
import { useRenderCounter } from './hooks/useRenderCounter';
import { useGridStore } from './hooks/useStore';

TetrisRuntime.runFork(
  GameContext.pipe(
    Effect.tap((ctx) => Effect.log('START')),
    Effect.provide(GameContextLive),
    Effect.uninterruptible,
  ),
);

export const GridView = () => {
  useRenderCounter('GridView');
  const boardCells = useGridStore((state) => state.positions);
  const layout = useGridStore((state) => state.layout);

  const cells = useMemo(
    () => Array.sort(Array.fromIterable(boardCells), Position.Order.sort),
    [boardCells],
  );

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
