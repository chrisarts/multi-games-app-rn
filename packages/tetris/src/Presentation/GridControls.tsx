import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Effect from 'effect/Effect';
import { useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { SlideOutLeft, SlideInRight } from 'react-native-reanimated';
import * as Game from '../Domain/Game.domain';
import * as GameAction from '../Domain/GameAction.domain';
import * as Position from '../Domain/Position.domain';
import { PlayerContext } from '../Services/Player.service';
import { TetrisRuntime } from '../Services/Runtime.layers';
import { GameStore } from '../Store/Game.store';

export const GridControls = () => {
  const [playerPublisher] = useState(() =>
    TetrisRuntime.runSync(PlayerContext.pipe(Effect.andThen((x) => x.publishAction))),
  );

  const gameState = GameStore.useGameStore((state) => state.gameStatus);
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

  const startGame = () => GameStore.setRunState(Game.GameRunState('InProgress'));

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
