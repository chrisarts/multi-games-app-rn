export const inclusiveClamp = (value: number, min: number, max: number) => {
  'worklet';
  return value < min ? min : value > max ? max : value;
};
