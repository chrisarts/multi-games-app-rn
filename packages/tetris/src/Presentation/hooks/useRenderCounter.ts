import { useId, useRef } from 'react';

export const useRenderCounter = (name: string) => {
  const id = useId();
  const renderCount = ++useRef(0).current;
  console.debug(`Component: ${name} - id ${id} - render#: ${renderCount}`);
};
