import React from 'react';
import { renderToStream, Font } from '@react-pdf/renderer';
import { Response } from 'express';
import { IntlProvider } from 'react-intl';

// Register fonts
Font.register({
  family: 'Inter-Regular',
  src: './public/static/fonts/Inter-Regular.otf',
});
Font.register({
  family: 'Inter-Bold',
  src: './public/static/fonts/Inter-Bold.otf',
});

export enum FontFamily {
  InterRegular = 'Inter-Regular',
  InterBold = 'Inter-Bold',
}

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
