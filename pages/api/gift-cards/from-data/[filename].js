import PDFDocument from 'pdfkit';
import fs from 'fs';
import SVGtoPDF from 'svg-to-pdfkit';
import moment from 'moment';
import QRCode from 'qr-image';
import { formatCurrency } from '../../../../lib/utils';

// Unit: 1pt = 1/72 inch = 0.352777239 mm
const MARGIN_IN_PTS = 40; // The margin between the edge of the page and cards
const SPACING_IN_PTS = 35; // The spacing between cards
const CARD_WIDTH_IN_PTS = 243;
const CARD_HEIGHT_IN_PTS = 153;
const CARD_PADDING = 10;
const NB_CARDS_PER_PAGE = 8;
const FONT_NORMAL = '.fonts/Inter-Regular.otf';
const FONT_BOLD = '.fonts/Inter-Bold.otf';

const OC_SVG_LOGO = fs.readFileSync('public/static/images/opencollective-icon.svg', 'utf8');
const LINK_SVG = fs.readFileSync('public/static/images/external-link.svg', 'utf8');

/**
 * Generate a PDF using PDFKit and return it as a buffer.
 */
export default async function handler(req, res) {
  // Cards can be passed as POST or GET params
  const cards = req.body?.cards || JSON.parse(req.query.cards);
  if (!cards) {
    return res.status(400).send('Malformed request');
  }

  // Set response headers
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="gift-cards.pdf"');

  // Generate doc
  const doc = new PDFDocument();
  doc.from;
  doc.pipe(res);
  doc.fillColor('#FFFFFF').fontSize(10);
  doc.font(FONT_NORMAL);

  // Add two cards per row, and 5 rows per page. Each card is 85.6 mm x 53.98 mm in (credit card size), so 243pt x 153pt
  for (const [absoluteIndex, card] of cards.entries()) {
    // Add a new page every 8 cards
    const relativeIndex = absoluteIndex % NB_CARDS_PER_PAGE;
    if (absoluteIndex && relativeIndex === 0) {
      doc.addPage();
    }

    // Get the x,y coordinates of the card
    const row = Math.floor(relativeIndex / 2);
    const col = relativeIndex % 2;
    const x = MARGIN_IN_PTS + col * (CARD_WIDTH_IN_PTS + SPACING_IN_PTS);
    const y = MARGIN_IN_PTS + row * (CARD_HEIGHT_IN_PTS + SPACING_IN_PTS);

    // Draw a rectangle around the card
    doc.rect(x, y, CARD_WIDTH_IN_PTS, CARD_HEIGHT_IN_PTS).dash(5, { space: 3 }).strokeColor('#EEEEEE').stroke();
    doc.undash();

    // Background
    doc.image('public/static/images/oc-gift-card-front-straightened.png', x, y, {
      width: CARD_WIDTH_IN_PTS,
      height: CARD_HEIGHT_IN_PTS,
    });

    // Open Collective branding
    SVGtoPDF(doc, OC_SVG_LOGO, x + CARD_PADDING, y + CARD_PADDING, { width: 30, height: 30 });
    doc
      .font(FONT_BOLD)
      .fontSize(10)
      .fillColor('#FFFFFF')
      .text('Open Collective', x + 45, y + 15);
    doc
      .font(FONT_NORMAL)
      .fontSize(6)
      .fillColor('#EEEEEE')
      .text('Transparent funding for open source', x + 45, y + 28);

    // Blue "Gift Card" rounded pill on the right
    doc
      .roundedRect(x + CARD_WIDTH_IN_PTS - 55, y + 18, 45, 15, 10)
      .fillColor('#69a0f1')
      .fill()
      .fillColor('#FFFFFF')
      .font(FONT_BOLD)
      .fontSize(7)
      .text('Gift Card', x + CARD_WIDTH_IN_PTS - 47.5, y + 21, { lineBreak: false });

    // Separator (not dashed)
    doc
      .moveTo(x + 10, y + 50)
      .lineTo(x + CARD_WIDTH_IN_PTS - CARD_PADDING, y + 50)
      .lineWidth(1)
      .strokeColor('#498bed')
      .stroke();

    // Description & expiry date
    doc
      .font(FONT_NORMAL)
      .fontSize(7)
      .fillColor('#FFFFFF')
      .text(card.name, x + CARD_PADDING, y + 57)
      .text(`Expires on ${moment(card.expiryDate).format('MMM D, YYYY')}`, x + CARD_PADDING, y + 67);

    // Link at the bottom left
    const urlPrefix = 'opencollective.com/redeem/';
    const distanceFromBottom = 15;

    SVGtoPDF(doc, LINK_SVG, x + CARD_PADDING, y + CARD_HEIGHT_IN_PTS - distanceFromBottom, {
      width: 8,
      height: 8,
      preserveAspectRatio: 'xMinYMin',
      colorCallback: () => [[150, 150, 150], 1],
    });

    const code = card.uuid.split('-')[0];
    doc
      .fontSize(7)
      .fillColor('#777777')
      .text(urlPrefix, x + 20, y + CARD_HEIGHT_IN_PTS - distanceFromBottom, { lineBreak: false })
      .fillColor('#000000')
      .text(code, x + 20 + doc.widthOfString(urlPrefix), y + CARD_HEIGHT_IN_PTS - distanceFromBottom, {
        lineBreak: false,
      })
      .link(
        x + 20,
        y + CARD_HEIGHT_IN_PTS - distanceFromBottom,
        doc.widthOfString(urlPrefix) + doc.widthOfString(code),
        8,
        `https://opencollective.com/redeem/${code}`,
      );

    // Amount at the bottom right
    const amountStr = formatCurrency(card.initialBalance, card.currency, { precision: 0 });
    doc
      .font(FONT_BOLD)
      .fontSize(12)
      .fillColor('#111111')
      .text(
        amountStr,
        x + CARD_WIDTH_IN_PTS - CARD_PADDING - doc.widthOfString(amountStr) - 15,
        y + CARD_HEIGHT_IN_PTS - 18,
        {
          lineBreak: false,
          align: 'right',
        },
      )
      .font(FONT_NORMAL)
      .fontSize(6)
      .fillColor('#777777')
      .text(card.currency, x + CARD_WIDTH_IN_PTS - CARD_PADDING - 14, y + CARD_HEIGHT_IN_PTS - 13, {
        lineBreak: false,
        align: 'right',
      });

    // QR code at the bottom right
    const QR_CODE_SIZE = 45;
    const qr = QRCode.imageSync(`https://opencollective.com/redeem/${code}`, { type: 'svg' });
    SVGtoPDF(doc, qr, x + CARD_WIDTH_IN_PTS - CARD_PADDING - QR_CODE_SIZE + 5, y + CARD_HEIGHT_IN_PTS - 65, {
      width: QR_CODE_SIZE,
      height: QR_CODE_SIZE,
      preserveAspectRatio: 'xMinYMin',
    });
  }

  doc.end();
}
