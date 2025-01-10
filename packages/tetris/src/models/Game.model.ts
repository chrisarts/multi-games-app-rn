import { type CustomStore, createStore } from '@games/shared';
import { BOARD_CONFIG } from '../utils/board.utils';
import { PlayerAction } from './Action.model';
import { MoveDirection } from './Block.model';
import { GameState, TickSpeed } from './Board.model';
import { BoardGrid } from './BoardGrid.model';
import { GridPoint } from './GridCell.model';

interface GameStore {
  status: GameState;
  board: BoardGrid;
  score: number;
  clearedRows: number;
  level: number;
  speed: TickSpeed;
}
export class GameModel {
  state: CustomStore<GameStore>;

  constructor() {
    const grid = new BoardGrid({
      width: BOARD_CONFIG.WIDTH,
      height: BOARD_CONFIG.HEIGHT,
    });
    this.state = createStore<GameStore>({
      status: GameState.STOP,
      clearedRows: 0,
      level: 0,
      score: 0,
      speed: TickSpeed.Normal,
      board: grid,
    });
  }

  moveBlock(direction: MoveDirection) {
    this.state.setState((prev) => {
      const nextPosition = prev.board.getMovePosition(direction);
      const isValidMove = prev.board.hasCollide(nextPosition);
      if (isValidMove.collide) {
        console.log('INVALID_MOVE', isValidMove.nextPoints);
      }
      console.log('MOVE: ', nextPosition);
      prev.board.updateBoard(GridPoint.create(nextPosition), isValidMove.collide);
      return {
        ...prev,
      };
    });
  }

  setState(status: GameState) {
    this.state.setState((prev) => {
      prev.status = status;
      return prev;
    });
  }

  static playerActions = {
    move: (direction: MoveDirection) => PlayerAction.move({ direction }),
    rotate: (direction: MoveDirection = MoveDirection.LEFT) =>
      PlayerAction.move({ direction }),
    play: PlayerAction.runState({ status: GameState.PLAYING }),
    stop: PlayerAction.runState({ status: GameState.STOP }),
    setSpeed: (speed: TickSpeed) => PlayerAction.setSpeed({ speed }),
  };
}

// function printTemplate(template: any, ...args: any[]) {
//   console.log('THH: ', this.name);
//   console.group('TEMPLATE');
//   console.log(template);
//   console.log('args', args);
//   for (const arg of args) {
//     if (typeof arg === 'function') {
//       console.log(arg, arg(1));
//       continue;
//     }
//     console.log('PRIMITIVE: ', arg);
//   }
//   console.groupEnd();
// }

// printTemplate.call({ name: 'asdasda' }, `template ${'hola'}`);
// printTemplate.apply({ name: 'asdasda' }, ['template', 'hola', (x) => x]);
// printTemplate(`template ${'hola'}`);
// printTemplate`template ${'hola'} ${(x) => `${x}`}`;
