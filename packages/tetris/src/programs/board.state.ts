import { Option } from 'effect';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as PubSub from 'effect/PubSub';
import * as Ref from 'effect/Ref';
import * as Stream from 'effect/Stream';
import type { MoveDirectionEnum } from '../models/Action.model';
import { getRandomBlock } from '../models/Block.model';
import {
  type BoardMatrix,
  type BoardPosition,
  type BoardState,
  CellState,
} from '../models/Board.model';
import { createTetrisBoard, getBlockShape, playerMoves } from '../utils';
import { BOARD_CONFIG } from '../utils/board.utils';

const firstBlock = getRandomBlock();
const firstShape = getBlockShape(firstBlock);

const make = Effect.gen(function* () {
  const boardRef = yield* Ref.make<BoardMatrix>(createTetrisBoard(BOARD_CONFIG));
  const boardStateRef = yield* Ref.make<BoardState>({
    collided: false,
    currentBlock: firstBlock,
    currentShape: firstShape,
    position: playerMoves.zero(),
  });
  const hub = yield* PubSub.unbounded<Option.Option<BoardPosition>>();

  return {
    boardRef: Ref.get(boardRef),
    move,
    subscribe,
    hub,
  };

  function subscribe() {
    return PubSub.subscribe(hub).pipe(
      Effect.andThen((_) =>
        Effect.addFinalizer(() => _.shutdown).pipe(Effect.map(() => _)),
      ),
      Effect.tap(() => Effect.logDebug('Subscribe to board state')),
      Effect.map(Stream.fromQueue),
    );
  }

  function move(action: MoveDirectionEnum) {
    return Effect.gen(function* () {
      const movement = yield* blockHasCollide(action);
      return yield* hub.publish(movement);
    });
  }

  function blockHasCollide(
    movedTo: BoardPosition,
  ): Effect.Effect<Option.Option<BoardPosition>> {
    return Effect.gen(function* () {
      const playerState = yield* Ref.get(boardStateRef);
      const boardState = yield* Ref.get(boardRef);
      const { shape } = playerState.currentShape;
      for (let row = 0; row < shape.length; row += 1) {
        for (let column = 0; column < shape[row].length; column += 1) {
          // 1. Check that we're on an actual Tetromino cell
          if (shape[row][column] !== 0) {
            const rowIndex = row + playerState.position.row + movedTo.row;
            const colIndex = column + playerState.position.column + movedTo.column;
            const rowCells = boardState[rowIndex];
            // 2. Check that our move is inside the game areas height (y)
            // That we're not moving through the bottom of the grid
            if (!rowCells) {
              return Option.none<BoardPosition>();
            }
            const cell = rowCells[colIndex];
            // 3. Check that our move is inside the game areas width (x)
            if (!cell) {
              return Option.none<BoardPosition>();
            }
            // 4. Check that the cell we're moving to isn't set to clear
            if (cell[1] !== CellState.EMPTY) {
              return Option.none<BoardPosition>();
            }
          }
        }
      }
      return Option.some(movedTo);
    });
  }

  function onMove() {}
});

export interface BoardStateCtx extends Effect.Effect.Success<typeof make> {}
export const BoardStateCtx = Context.GenericTag<BoardStateCtx>('BoardStateCtx');
export const BoardStateCtxLive = Layer.scoped(BoardStateCtx, make);
