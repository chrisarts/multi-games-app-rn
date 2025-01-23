import { type ReactNode, createContext, useContext, useState } from 'react';
import { type TetrisGame, createGame } from '../../Domain/Game.domain';

export const GameContext = createContext<TetrisGame>(createGame());

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [game] = useState(createGame());

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};

export const useGameContext = () => useContext(GameContext);
