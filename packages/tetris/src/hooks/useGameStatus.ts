import { useEffect, useState } from 'react';
import { ROW_POINTS } from '../old-models/Board.model';

export const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (rowsCleared > 0) {
      setScore((prev) => prev + ROW_POINTS[rowsCleared - 1] * level);
      setRows((prev) => prev + rowsCleared);
    }
  }, [rowsCleared, level]);

  return { score, setScore, rows, setRows, level, setLevel };
};
