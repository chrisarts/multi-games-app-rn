import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable } from 'react-native';
import Animated, { SlideOutLeft, SlideInRight } from 'react-native-reanimated';
import { runActionOnUI } from '../Application/RunPlayerAction.program';
import * as Game from '../Domain/GameState.domain';
import { useGameStore } from './hooks/useStore';

export const GridControls = () => {
  const gameState = useGameStore((state) => state.game.status);

  return (
    <Animated.View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {gameState === 'InProgress' && (
        <Animated.View
          style={{
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}
          entering={SlideInRight}
          exiting={SlideOutLeft}
        >
          <BoardButton icon='arrow-left-circle-outline' action={runActionOnUI.moveLeft} />
          <BoardButton icon='arrow-down-circle-outline' action={runActionOnUI.moveDown} />
          <BoardButton
            icon='arrow-right-circle-outline'
            action={runActionOnUI.moveRight}
          />
          <BoardButton icon='rotate-left-variant' action={runActionOnUI.rotate} />
        </Animated.View>
      )}

      {gameState === 'Stop' && (
        <Animated.View
          style={{ justifyContent: 'center', alignItems: 'center' }}
          entering={SlideInRight}
          exiting={SlideOutLeft}
        >
          <BoardButton icon='play-circle-outline' action={runActionOnUI.startGame} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

interface BoardButtonProps {
  action: () => void;
  icon: keyof (typeof MaterialCommunityIcons)['glyphMap'];
}
export const BoardButton = ({ action, icon }: BoardButtonProps) => {
  return (
    <Pressable onPress={action}>
      <MaterialCommunityIcons
        name={icon}
        color='rgba(131, 126, 126, 1)'
        size={80}
        style={{
          paddingRight: 4,
          paddingTop: 3,
        }}
      />
    </Pressable>
  );
};
