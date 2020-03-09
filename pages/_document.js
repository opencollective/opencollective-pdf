import React from 'react';
import path from 'path';
import PropTypes from 'prop-types';
import NextJSDocument from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { componentToPDFBuffer } from '../lib/pdf-utils';

/**
 * A wrapper for PDF documents that injects the styles in the page and add some global
 * styles for PDF documents to display correctly.
 *
 * To understand why we reset the zoom here, see https://github.com/marcbachmann/node-html-pdf/issues/110
 */
const PDFDocument = ({ html, styles, zoom }) => {
  return (
    <html style={{ zoom }}>
      <head>
        <meta charSet="utf-8" />
        {styles && <style>{styles}</style>}
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <div id="__next" dangerouslySetInnerHTML={{ __html: html }} />
      </body>
    </html>
  );
};

PDFDocument.defaultProps = {
  zoom: 0.75,
};

PDFDocument.propTypes = {
  html: PropTypes.string,
  styles: PropTypes.string,
  zoom: PropTypes.number.isRequired,
};

const getRawCssFromSheet = sheet => {
  return sheet
    .getStyleElement()
    .map(e => e.props.dangerouslySetInnerHTML.__html)
    .join();
};

const getFileFormatFromCtx = ctx => {
  if (ctx.format) {
    return ctx.format;
  } else if (ctx.req) {
    const urlPath = ctx.req.url.split('?')[0];
    const parsedPath = path.parse(urlPath);
    return parsedPath.ext.slice(1);
  } else if (ctx.pathname) {
    const urlPath = ctx.pathname.split('?')[0];
    const parsedPath = path.parse(urlPath);
    return parsedPath.ext.slice(1);
  }
};

/**
 * Document wrapper that includes styled-components.
 * See https://github.com/zeit/next.js/blob/master/examples/wit\h-styled-components/pages/_document.js
 */
export default class Document extends NextJSDocument {
  static async getInitialProps(ctx) {
    const { req, res, query } = ctx;
    const originalRenderPage = ctx.renderPage;
    const isServer = Boolean(req);
    const sheet = new ServerStyleSheet();

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const fileFormat = getFileFormatFromCtx(ctx);
      const initialProps = await NextJSDocument.getInitialProps(ctx);
      const isPdf = ctx.pathname !== '/' && fileFormat === 'pdf';
      if (isServer && isPdf) {
        const htmlContent = ctx.renderPage().html;
        const buffer = await componentToPDFBuffer(
          <PDFDocument html={htmlContent} styles={getRawCssFromSheet(sheet)} />,
          { pageFormat: query.pageFormat || 'A4' },
        );
        res.setHeader('Content-disposition', `inline; filename="test.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.end(buffer);
      }

      return {
        ...initialProps,
        isPdf,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
