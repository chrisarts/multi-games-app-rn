import * as Array from 'effect/Array';
import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import Animated, {
  EntryExitTransition,
  FlipInEasyX,
  FlipOutEasyY,
  LinearTransition,
  ReduceMotion,
} from 'react-native-reanimated';
import { runForkedTetris } from '../Application/RunGame';
import * as Position from '../Domain/Position.domain';
import { TetrisRuntime } from '../Services/Runtime.layers';
import { CellView } from './Cell.view';
import { GridControls } from './GridControls';
import { useRenderCounter } from './hooks/useRenderCounter';
import { useGridStore } from './hooks/useStore';

const transition = EntryExitTransition.duration(1000)
  .delay(500)
  .entering(FlipInEasyX)
  .exiting(FlipOutEasyY)
  .reduceMotion(ReduceMotion.Never)
  .withCallback((finished) => {
    console.log(`finished without interruptions: ${finished}`);
  });

TetrisRuntime.runFork(runForkedTetris);

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
      <Animated.FlatList
        data={cells}
        keyExtractor={(x) => `${x.row},${x.column}`}
        numColumns={layout.size.columns}
        itemLayoutAnimation={transition}
        renderItem={({ item }) => <CellView cellLayout={layout.cell} position={item} />}
      />
      <GridControls />
    </View>
  );
};
