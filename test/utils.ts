import { CompareOptions, comparePdfToSnapshot } from 'pdf-visual-diff';
import zlib from 'node:zlib';

export const snapshotPDF = async (
  pdfContent: Buffer,
  snapshotName: string,
  options: Omit<CompareOptions, 'failOnMissingSnapshot'> = {},
) => {
  if (
    !(await comparePdfToSnapshot(pdfContent, './test', snapshotName, {
      failOnMissingSnapshot: process.env.OC_ENV === 'CI',
      ...options,
    }))
  ) {
    throw new Error(`PDF snapshot ${snapshotName} does not match`);
  }
};

/**
 * Generates a valid RGB PNG of the given size, to identify it in a rendered PDF (`/Width <width>`).
 */
export const createPng = (width: number, height: number): Buffer => {
  const chunk = (type: string, data: Buffer) => {
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(typeAndData));
    return Buffer.concat([length, typeAndData, crc]);
  };

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // Bit depth
  header[9] = 2; // Color type: RGB
  const row = Buffer.concat([Buffer.from([0]), Buffer.alloc(width * 3, 0x80)]);
  const pixels = zlib.deflateSync(Buffer.concat(Array.from({ length: height }, () => row)));

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', pixels),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

/**
 * Returns the widths of all the images embedded in a PDF.
 */
export const getPdfImageWidths = (pdf: Buffer): number[] => {
  const content = pdf.toString('latin1');
  return [...content.matchAll(/\/Subtype \/Image[\s\S]*?\/Width (\d+)/g)].map(match => Number(match[1]));
};
