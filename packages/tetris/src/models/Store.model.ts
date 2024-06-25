// class TetrisStore {
//   readonly shapes: number = 1;
// }

import { createStore } from "@games/shared";
import { BoardCell } from "./Board.model";
import { BoardPosition } from "./Point.model";

export const store = createStore({
  cells: new Map<string, BoardCell>(),
});

export const registerCell = (position: BoardPosition, cell: BoardCell) => {
  const key = JSON.stringify(position);
  const registered = store.getState().cells.get(key);
  if (registered) {
    return registered;
  }
  store.getState().cells.set(key, cell);
  // store.emitChanges();
  return store.getState().cells.get(key)!;
};
