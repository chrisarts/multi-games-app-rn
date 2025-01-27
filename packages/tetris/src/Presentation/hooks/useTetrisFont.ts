import { matchFont, useFonts } from '@shopify/react-native-skia';

export const useTetrisFont = () => {
  const tetrisFonts = useFonts({
    Digital: [
      require('../../Data/fonts/Digital-Bold.ttf'),
      require('../../Data/fonts/Digital-Italic.ttf'),
      require('../../Data/fonts/Digital-ItalicBold.ttf'),
      require('../../Data/fonts/Digital-Regular.ttf'),
    ],
  });

  const bold = {
    fontFamily: 'Digital',
    fontWeight: 'bold',
    fontSize: 20,
  } as const;

  const fontBold = tetrisFonts ? matchFont(bold, tetrisFonts) : null;
  const fontRegular = tetrisFonts
    ? matchFont(
        {
          ...bold,
          fontWeight: 'normal',
        },
        tetrisFonts,
      )
    : null;
  const fontItalic = tetrisFonts
    ? matchFont(
        {
          ...bold,
          fontWeight: 'normal',
          fontStyle: 'italic',
        },
        tetrisFonts,
      )
    : null;

  const fontItalicBold = tetrisFonts
    ? matchFont(
        {
          ...bold,
          fontWeight: 'bold',
          fontStyle: 'italic',
        },
        tetrisFonts,
      )
    : null;

  const getFont = (size: number, weight: 'bold' | 'normal') => {
    'worklet';
    if (!tetrisFonts) return null;
    return matchFont(
      {
        ...bold,
        fontWeight: weight,
        fontStyle: 'italic',
        fontSize: size,
      },
      tetrisFonts,
    );
  };

  return {
    fontBold,
    fontRegular,
    fontItalic,
    fontItalicBold,
    tetrisFonts,
    getFont,
    ready: !!fontBold && !!fontItalic && !!fontItalicBold && !!fontRegular,
  };
};
