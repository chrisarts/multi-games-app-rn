import { useEffect, useMemo, useState } from "react";
import { pipe } from "effect/Function";
import * as ReadOnlyArray from "effect/Array";
import * as Option from "effect/Option";
import { FlatList, SafeAreaView, Text, View, StyleSheet } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { randomShape } from "../models/Block.model";
import {
  checkCollision,
  createTetrisBoard,
  updateBoardForShape,
} from "../models/Board.model";

let tetrisShape = randomShape();
export const TetrisBoard = () => {
  const [board, setBoard] = useState(createTetrisBoard(15, 10));
  const [position, setPosition] = useState(board.startPoint);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("POSITION: ", position);
      const collide = checkCollision(tetrisShape, board.matrix, position, {
        x: 0,
        y: 1,
      });
      if (collide) {
        clearInterval(interval);
      } else {
        setPosition((pos) => ({
          ...pos,
          x: pos.x,
          y: pos.y + 1,
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [position]);

  return (
    <FlatList
      scrollEnabled={false}
      data={updateBoardForShape(board.matrix, position, tetrisShape)}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item: columns }) => (
        <FlatList
          scrollEnabled={false}
          data={columns}
          horizontal
          renderItem={({ item: cell }) => {
            return <TetrisCell cell={cell} color={tetrisShape.color} />;
          }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
