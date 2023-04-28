import { renderToStaticMarkup } from 'react-dom/server';
import sanitizeHtmlLib from 'sanitize-html';
import pdf from 'html-pdf';

/**
 * Sanitize HTML with only safe values
 */
const sanitizeHtml = (html) => {
  return sanitizeHtmlLib(html, {
    allowVulnerableTags: true,
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat([
      'img',
      'style',
      'html',
      'body',
      'meta',
      'head',
      'label',
      // SVG
      'svg',
      'path',
      'polyline',
      'line',
    ]),
    allowedSchemes: ['https', 'data'],
    allowedAttributes: Object.assign(sanitizeHtmlLib.defaults.allowedAttributes, {
      '*': ['style', 'class', 'id', 'height', 'width'],
      td: ['width'],
      meta: ['charset'],
      img: ['src', 'srcset', 'alt'],
      // SVG
      svg: [
        'shape-rendering',
        'viewBox',
        'style',
        'aria-hidden',
        'stroke-linecap',
        'stroke-linejoin',
        'focusable',
        'fill',
        'stroke',
        'color',
      ],
      path: ['fill', 'd'],
      polyline: ['points'],
      line: ['x1', 'x2', 'y1', 'y2'],
    }),
    parser: {
      lowerCaseAttributeNames: false,
    },
  });
};

/**
 * Renders the component info a PDF file.
 *
 * @param {*} component
 * @param {object} pdfOptions
 */
export const componentToPDFBuffer = async (component, pdfOptions) => {
  return new Promise((resolve, reject) => {
    const html = renderToStaticMarkup(component);
    const cleanHtml = sanitizeHtml(html);

    const options = {
      format: 'A4',
      orientation: 'portrait',
      type: 'pdf',
      timeout: 30000,
      localUrlAccess: true,
      // These 2 lines can be useful in dev to solve PhantomJS issues
      // phantomPath: './node_modules/phantomjs-prebuilt/bin/phantomjs',
      // phantomArgs: ['--ignore-ssl-errors=yes'],
      ...pdfOptions,
    };

    pdf.create(cleanHtml, options).toBuffer((err, buffer) => {
      if (err) {
        return reject(err);
      }

      return resolve(buffer);
    });
  });
};
