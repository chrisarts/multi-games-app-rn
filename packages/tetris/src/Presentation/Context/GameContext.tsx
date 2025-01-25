import { point } from '@shopify/react-native-skia';
import { type ReactNode, createContext, useContext, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  type GridConfig,
  type TetrisGrid,
  getGridConfig,
  getGridLayout,
} from '../../Domain/Grid.domain';

export interface TetrisGameContext {
  tetrisGrid: TetrisGrid;
  gridConfig: GridConfig;
  gridMatrix: TetrisGrid['cellsMatrix'];
}

export const GameContext = createContext<TetrisGameContext>({} as TetrisGameContext);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const [options, _setOptions] = useState({
    showEmptyCells: true,
  });
  const [game] = useState(() => {
    const dimensions = Dimensions.get('window');
    const gridConfig = getGridConfig(
      dimensions,
      insets,
      { columns: 10, rows: 15 },
      options,
    );
    const tetrisGrid = getGridLayout(gridConfig, gridConfig);
    return {
      tetrisGrid,
      gridConfig,
      gridMatrix: tetrisGrid.matrix.map((row, iy) =>
        row.map((column, ix) => ({
          point: point(ix, iy),
          value: column,
          color: 'rgba(131, 126, 126, 0.3)',
        })),
      ),
    };
  });

  return (
    <GameContext.Provider
      value={{
        tetrisGrid: game.tetrisGrid,
        gridConfig: game.gridConfig,
        gridMatrix: game.gridMatrix,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
