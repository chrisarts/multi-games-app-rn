import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Effect from 'effect/Effect';
import { Pressable } from 'react-native';
import Animated, { SlideOutLeft, SlideInRight } from 'react-native-reanimated';
import * as Game from '../Domain/Game.domain';
import * as GameAction from '../Domain/GameAction.domain';
import * as Position from '../Domain/Position.domain';
import { PlayerContext, PlayerContextLive } from '../Services/Player.service';
import { GameStore } from '../Store/Game.store';
import { useGameStore } from './hooks/useStore';

const playerPublisher = Effect.runSync(
  PlayerContext.pipe(
    Effect.map((x) => x.publishAction),
    Effect.provide(PlayerContextLive),
    Effect.uninterruptible,
  ),
);

export const GridControls = () => {
  const gameState = useGameStore((state) => state.gameStatus);

  const moveLeft = () =>
    playerPublisher(GameAction.GameAction.move({ to: GameAction.makeMove.left() }));

  const moveRight = () =>
    playerPublisher(GameAction.GameAction.move({ to: GameAction.makeMove.right() }));
  const moveDown = () =>
    playerPublisher(GameAction.GameAction.move({ to: GameAction.makeMove.down() }));
  const rotate = () =>
    playerPublisher(
      GameAction.GameAction.rotate({ to: GameAction.MoveAction.down(Position.zero()) }),
    );

  const startGame = () => {
    console.log('STAAAAART!');
    GameStore.setState((x) => {
      x.gameStatus = Game.GameRunState('InProgress');
      return x;
    });
    playerPublisher(
      GameAction.GameAction.statusChange({ state: Game.GameRunState('InProgress') }),
    );
  };

  return (
    <Animated.View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {gameState === Game.GameRunState('InProgress') && (
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

      {gameState === Game.GameRunState('Stop') && (
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
