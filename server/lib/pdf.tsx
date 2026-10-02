import React from 'react';
import { Font, renderToStream } from '@react-pdf/renderer';
import { Response } from 'express';
import { IntlProvider } from 'react-intl';

export enum FontFamily {
  InterRegular = 'Inter-Regular',
  InterBold = 'Inter-Bold',
  InterItalic = 'Inter-Italic',
  NanumGothic = 'NanumGothic',
}

Font.register({
  family: FontFamily.InterRegular,
  src: './public/static/fonts/Inter-Regular.otf',
});

Font.register({
  family: FontFamily.InterBold,
  src: './public/static/fonts/Inter-Bold.otf',
});

Font.register({
  family: FontFamily.InterItalic,
  src: './public/static/fonts/Inter-Italic.otf',
});

Font.register({
  family: FontFamily.NanumGothic,
  src: './public/static/fonts/NanumGothic-Regular.ttf',
});

export const getFontStyleForText = (...values: Array<string | null | undefined>) =>
  values.some(value => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(value || ''))
    ? { fontFamily: FontFamily.NanumGothic }
    : undefined;

export async function sendPDFResponse<PropTypes extends object>(
  res: Response,
  Component: React.ComponentType<PropTypes>,
  props: PropTypes,
) {
  try {
    const stream = await renderToStream(
      <IntlProvider locale="en">
        <Component {...props} />
      </IntlProvider>,
    );
    res.setHeader('Content-Type', 'application/pdf');
    stream.pipe(res);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
