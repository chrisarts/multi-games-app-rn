import { type SkHostRect, type SkRect, rect } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { useTetrisFont } from './useTetrisFont';

const maxPad = '000000';

export const useTextInfoRect = (
  rawValue: SharedValue<number>,
  prevRect: SharedValue<SkHostRect>,
  gridInfoSquare: SharedValue<SkRect>,
) => {
  const { fontItalicBold } = useTetrisFont();
  const skRect = useDerivedValue(() =>
    rect(
      gridInfoSquare.value.x,
      (prevRect.value.y + prevRect.value.height) * 1.02,
      gridInfoSquare.value.width * 0.9,
      gridInfoSquare.value.width,
    ),
  );

  const text = useDerivedValue(() => {
    const fullNumber = `${rawValue.value}`;
    const lessPad = maxPad.length - fullNumber.length;
    return fullNumber.padStart(lessPad, '0');
  });

  const translate = useDerivedValue(() => {
    const textMeasure =
      fontItalicBold?.measureText(text.value) ??
      rect(0, 0, 18 * text.value.length, 18 * text.value.length);
    const textMidX = textMeasure.width / 2;
    const rectMidX = skRect.value.width / 2;
    const rectMidY = skRect.value.height / 2;
    return [
      {
        translate: [rectMidX - textMidX, rectMidY + textMeasure.height] as const,
      },
    ];
  });

  return {
    text,
    translate,
    skRect,
  };
};
