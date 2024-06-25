import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as ReadOnlyArray from "effect/Array";

export class BoardContext extends Context.Tag("BoardContext")<
  BoardContext,
  {}
>() {
  
}

const rows = Array.from([null]);
rows.length = 10;
const columns = Array.from([null]);
columns.length = 26;

ReadOnlyArray.allocate(10);

const createGrid = Effect.gen(function* () {
  const context = yield* BoardContext;
  const grid = null;
  return "";
});
