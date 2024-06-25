import { useEffect, useRef } from "react";

export const useInterval = (callback: () => void, delay: number | null) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => callbackRef.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};
