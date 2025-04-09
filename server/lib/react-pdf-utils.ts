import { Font, StyleSheet } from '@react-pdf/renderer';
import { FontFamily } from './pdf';

export const createStylesheetWithFonts = (values: Parameters<(typeof StyleSheet)['create']>[0]) => {
  Font.register({
    family: FontFamily.InterRegular,
    src: './public/static/fonts/Inter-Regular.otf',
  });

  Font.register({
    family: FontFamily.InterBold,
    src: './public/static/fonts/Inter-Bold.otf',
  });

  return StyleSheet.create(values);
};
