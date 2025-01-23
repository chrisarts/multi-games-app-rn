import { useSharedValue } from 'react-native-reanimated';
import { getRandomTetromino } from '../../Domain/Tetromino.domain';
import { useGameContext } from '../context/GameContext';

export const useTetromino = () => {
  const { gridConfig } = useGameContext();
  const tetromino = useSharedValue(
    getRandomTetromino(gridConfig, gridConfig.cellContainerSize),
  );
  const position = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const resetPosition = () => {
    'worklet';
    position.x.value = 0;
    position.y.value = 0;
  };

  return {
    tetromino,
    position,
    resetPosition,
  };
};
