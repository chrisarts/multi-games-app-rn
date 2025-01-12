// import { type CustomStore, createStore } from '@games/shared';
// import { GameRunState } from '../Domain/Game.domain';
// import { BOARD_CONFIG } from '../old-models/board.utils';
// import { CollisionResult, type MoveDirection, TickSpeed } from './Action.model';
// import { BoardGrid } from './BoardGrid.model';

// interface GameStore {
//   status: GameRunState;
//   board: BoardGrid;
//   score: number;
//   clearedRows: number;
//   level: number;
//   speed: number;
// }
// export class GameModel {
//   state: CustomStore<GameStore>;
//   private get board() {
//     return this.state.getState().board;
//   }

//   constructor() {
//     const grid = new BoardGrid({
//       rows: BOARD_CONFIG.WIDTH,
//       columns: BOARD_CONFIG.HEIGHT,
//     });
//     this.state = createStore<GameStore>({
//       status: GameRunState('Stop'),
//       clearedRows: 0,
//       level: 0,
//       score: 0,
//       speed: TickSpeed.Normal,
//       board: grid,
//     });
//   }

//   moveBlock(direction: MoveDirection) {
//     const collision = this.board.checkMoveCollision(direction);
//     CollisionResult.$match({
//       CLEAR: ({ toPoint }) => {
//         this.board.updateBoard(toPoint, false);
//       },
//       LIMIT_REACHED: ({ gameOver, merge }) => {
//         console.log('LIMIT: ', { gameOver, merge });
//         if (merge) {
//           this.board.updateBoard(this.board.currentBlock.currentPosition, true);
//         }
//       },
//       MERGED_SIBLING: ({ sibling, gameOver }) => {
//         if (!gameOver)
//           this.board.updateBoard(this.board.currentBlock.currentPosition, true);
//       },
//     })(collision);
//     if (CollisionResult.$is('MERGED_SIBLING')(collision) && collision.gameOver) {
//       return this.setRunStatus(GameRunState('Stop'));
//     }

//     this.state.setState((prev) => {
//       return { ...prev };
//     });
//   }

//   rotateBlock() {
//     const nextShape = this.state.getState().board.currentBlock.getState().nextShape;
//     const board = this.state.getState().board;
//     // for (const point of points) {
//     //   if (board.pointHasCollision(point)) {
//     //     console.log('ROTATION_BLOCK');
//     //     return;
//     //   }
//     // }
//     // this.state.setState((prev) => {
//     //   prev.board.currentBlock.shape = rotatedShape;
//     //   prev.board.updateBoard(prev.board.currentBlock.position, false);
//     //   return prev;
//     // });
//   }

//   setRunStatus(status: GameRunState) {
//     this.state.setState((prev) => {
//       prev.status = status;
//       return prev;
//     });
//   }

//   // static playerActions = {
//   //   move: (direction: MoveDirection) =>
//   //     PlayerAction.move({ direction }),
//   //   play: PlayerAction.runState({ status: _GameState.PLAYING }),
//   //   stop: PlayerAction.runState({ status: _GameState.STOP }),
//   //   setSpeed: (speed: __TickSpeed) => PlayerAction.setSpeed({ speed }),
//   // };
// }

// // function printTemplate(template: any, ...args: any[]) {
// //   console.log('THH: ', this.name);
// //   console.group('TEMPLATE');
// //   console.log(template);
// //   console.log('args', args);
// //   for (const arg of args) {
// //     if (typeof arg === 'function') {
// //       console.log(arg, arg(1));
// //       continue;
// //     }
// //     console.log('PRIMITIVE: ', arg);
// //   }
// //   console.groupEnd();
// // }

// // printTemplate.call({ name: 'asdasda' }, `template ${'hola'}`);
// // printTemplate.apply({ name: 'asdasda' }, ['template', 'hola', (x) => x]);
// // printTemplate(`template ${'hola'}`);
// // printTemplate`template ${'hola'} ${(x) => `${x}`}`;
