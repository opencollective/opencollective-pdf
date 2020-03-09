import { renderToStaticMarkup } from 'react-dom/server';
import sanitizeHtmlLib from 'sanitize-html';
import pdf from 'html-pdf';

/**
 * Sanitize HTML with only safe values
 */
const sanitizeHtml = html => {
  return sanitizeHtmlLib(html, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat([
      'img',
      'style',
      'h1',
      'h2',
      'span',
      'html',
      'body',
      'meta',
      'head',
      'label',
    ]),
    allowedSchemes: ['https', 'data'],
    allowedAttributes: Object.assign(sanitizeHtmlLib.defaults.allowedAttributes, {
      '*': ['style', 'class', 'id'],
      td: ['width'],
      meta: ['charset'],
    }),
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
