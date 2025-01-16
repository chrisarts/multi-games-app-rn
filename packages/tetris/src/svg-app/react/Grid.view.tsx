import * as Array from 'effect/Array';
import { useMemo } from 'react';
import Animated, {
  EntryExitTransition,
  FlipInEasyX,
  FlipOutEasyY,
  ReduceMotion,
} from 'react-native-reanimated';
import { TetrisRuntime } from '../../App/Services/Runtime.layers';
import { runForkedTetris } from '../../Application/RunGame';
import * as Position from '../../Domain/Position.domain';
import { GridControls } from '../GameControls.view';
import { useRenderCounter } from '../hooks/useRenderCounter';
import { useGridStore } from '../hooks/useStore';
import { CellView } from './Cell.view';

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
    () => Array.fromIterable(boardCells).sort(Position.Order.sort),
    [boardCells],
  );

  return (
    <Animated.View style={{ flex: 1 }}>
      <Animated.FlatList
        data={cells}
        keyExtractor={(x) => `${x.row},${x.column}`}
        numColumns={layout.size.columns}
        itemLayoutAnimation={transition}
        renderItem={({ item }) => <CellView cellLayout={layout.cell} position={item} />}
      />
      <GridControls />
    </Animated.View>
  );
};
