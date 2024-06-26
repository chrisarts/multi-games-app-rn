import Animated, { SlideOutLeft, SlideInRight } from 'react-native-reanimated';
import { GameState } from '../../models';
import { BoardButton } from './BoardButton';

interface BoardControlsProps {
  gameState: GameState;
  startGame: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
}
export const BoardControls = ({
  gameState,
  moveLeft,
  moveRight,
  rotate,
  startGame,
  moveDown,
}: BoardControlsProps) => {
  return (
    <Animated.View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {gameState === GameState.PLAYING && (
        <Animated.View
          style={{
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}
          entering={SlideInRight}
          exiting={SlideOutLeft}
        >
          <BoardButton icon='arrow-left-circle-outline' action={moveLeft} />
          <BoardButton icon='arrow-down-circle-outline' action={moveDown} />
          <BoardButton icon='arrow-right-circle-outline' action={moveRight} />
          <BoardButton icon='rotate-left-variant' action={rotate} />
        </Animated.View>
      )}

      {gameState === GameState.STOP && (
        <Animated.View
          style={{ justifyContent: 'center', alignItems: 'center' }}
          entering={SlideInRight}
          exiting={SlideOutLeft}
        >
          <BoardButton icon='play-circle-outline' action={startGame} />
        </Animated.View>
      )}
    </Animated.View>
  );
};
