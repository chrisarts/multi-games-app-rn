import { Dimensions } from 'react-native';
import * as Grid from './Grid.domain';
import { getAllTetrominos } from './Tetromino.domain';

export const createGame = () => {
  'worklet';
  const dimensions = Dimensions.get('screen');
  const gridConfig = Grid.getGridConfig(dimensions.width, { rows: 15, columns: 10 });
  const allShapes = getAllTetrominos(gridConfig, gridConfig.cellContainerSize);
  const getRandomShapeIndex = () => {
    'worklet';
    return Math.floor(Math.random() * allShapes.length);
  };
  const tetrisGrid = Grid.getGridLayout(gridConfig, gridConfig);

  return {
    getRandomShapeIndex,
    tetrisGrid,
    gridConfig,
    firstShape: allShapes[getRandomShapeIndex()],
    allShapes,
  };
};
