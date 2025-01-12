import { useId, useRef } from 'react';

export const useRenderCounter = (name: string, print?: (count: number) => boolean) => {
  const id = useId();
  const renderCount = ++useRef(0).current;
  if (!print) {
    console.debug(`Component: ${name} - id ${id} - render#: ${renderCount}`);
  } else {
    if (print(renderCount)) {
      console.debug(`Component: ${name} - id ${id} - render#: ${renderCount}`);
    }
  }
};
