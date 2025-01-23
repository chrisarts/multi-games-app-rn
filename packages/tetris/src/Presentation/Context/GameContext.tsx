import { point } from '@shopify/react-native-skia';
import { type ReactNode, createContext, useContext, useState } from 'react';
import { Dimensions } from 'react-native';
import {
  type GridConfig,
  type TetrisGrid,
  type TetrisGridCell,
  getGridConfig,
  getGridLayout,
} from '../../Domain/Grid.domain';

export interface TetrisGameContext {
  tetrisGrid: TetrisGrid;
  gridConfig: GridConfig;
  gridMatrix: TetrisGridCell[][];
}

export const GameContext = createContext<TetrisGameContext>({} as TetrisGameContext);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [game] = useState(() => {
    const dimensions = Dimensions.get('screen');
    const gridConfig = getGridConfig(dimensions.width, { columns: 10, rows: 15 });
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
