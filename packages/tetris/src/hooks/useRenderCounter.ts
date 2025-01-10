import { useId, useRef } from 'react';

export const useRenderCounter = () => {
  const id = useId();
  console.debug(`id: ${id} - render#: ${++useRef(0).current}`);
};
