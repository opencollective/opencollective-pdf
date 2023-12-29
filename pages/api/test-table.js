import PDFDocument from 'pdfkit-table';
import path from 'path';

// Unit: 1pt = 1/72 inch = 0.352777239 mm
const FONT_NORMAL = path.join(process.cwd(), '.fonts/Inter-Regular.otf');
const FONT_BOLD = path.join(process.cwd(), '.fonts/Inter-Bold.otf');

/**
 * Generate a PDF using PDFKit and return it as a buffer.
 */
export default async function handler(req, res) {
  // Set response headers
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/pdf');
  // res.setHeader('Content-Disposition', 'attachment; filename="gift-cards.pdf"');

  // Generate doc
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fillColor('#000000').fontSize(10);
  doc.font(FONT_NORMAL);

  doc.table(
    {
      title: 'Payment Receipt',
      headers: [
        { label: 'Date', align: 'left', headerColor: '#36bcff' },
        { label: 'Description', align: 'left', headerColor: '#36bcff' },
        { label: 'QTY', align: 'left', headerColor: '#36bcff' },
        { label: 'Unit Price', align: 'left', headerColor: '#36bcff' },
        { label: 'Tax', align: 'left', headerColor: '#36bcff' },
        { label: 'Net Amount', align: 'right', headerColor: '#36bcff' },
      ],
      rows: [
        ['2020-01-01', 'Financial contribution to Dark Reader', '1', '$5.00', '0%', '$5.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-06-01', 'TShirt from Babel', '1', '$20.00', '0%', '$20.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
        ['2021-01-01', 'Financial contribution to Webpack', '1', '$15.00', '0%', '$15.00'],
      ],
    },
    {
      columnsSize: [60, 150, 20, 100, 20, 100],
    },
  );

  // Show Subtotal + Total on the bottom right of the table
  // Subtotal
  doc
    .font(FONT_BOLD)
    .fontSize(10)
    .text('Subtotal', 350, doc.y, { lineBreak: false, align: 'right' })
    .text('$5.00', 490, doc.y, { lineBreak: false, align: 'right' });

  // Blue box for the total
  doc
    .rect(325, doc.y + 20, 200, 25)
    .fillColor('#F0F8FF')
    .fill();

  // Total
  doc
    .font(FONT_BOLD)
    .fontSize(10)
    .fillColor('#000000')
    .text('Total', 350, doc.y + 25, { lineBreak: false, align: 'right' })
    .text('$5.00', 490, doc.y, { lineBreak: false, align: 'right' });

  doc.end();
}
