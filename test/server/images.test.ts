import { Readable } from 'node:stream';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest';
import nock from 'nock';
import { detectImageFormat, loadEmbeddedImage, MAX_EMBEDDED_IMAGE_SIZE_BYTES } from '../../server/lib/images.js';
import { reportErrorToSentry, reportMessageToSentry } from '../../server/lib/sentry.js';
import { createPng } from '../utils.js';

vi.mock('../../server/lib/sentry.js', async importOriginal => ({
  ...(await importOriginal<typeof import('../../server/lib/sentry.js')>()),
  reportErrorToSentry: vi.fn(),
  reportMessageToSentry: vi.fn(),
}));

const expectRejectionReported = (reason: string, extra: Record<string, unknown> = {}) => {
  expect(reportMessageToSentry).toHaveBeenCalledWith(`Invoice template image rejected: ${reason}`, {
    severity: 'warning',
    tags: { feature: 'pdf-images', reason },
    extra: expect.objectContaining(extra),
  });
};

const png = createPng(3, 2);
const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>';
const pngDataUrl = `data:image/png;base64,${png.toString('base64')}`;

describe('lib/images', () => {
  describe('detectImageFormat', () => {
    test('detects PNG and JPEG files from their signature', () => {
      expect(detectImageFormat(png)).toBe('png');
      expect(detectImageFormat(jpeg)).toBe('jpeg');
    });

    test('returns null for other formats', () => {
      expect(detectImageFormat(Buffer.from(svg))).toBeNull();
      expect(detectImageFormat(Buffer.from('GIF89a'))).toBeNull();
      expect(detectImageFormat(Buffer.alloc(0))).toBeNull();
    });
  });

  describe('loadEmbeddedImage', () => {
    beforeEach(() => {
      nock.disableNetConnect();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.enableNetConnect();
      vi.mocked(reportErrorToSentry).mockReset();
      vi.mocked(reportMessageToSentry).mockReset();
    });

    test('returns null for empty or non-string values', async () => {
      for (const value of [
        null,
        undefined,
        '',
        42,
        true,
        { url: 'https://example.com/a.png' },
        ['https://example.com/a.png'],
      ]) {
        expect(await loadEmbeddedImage(value)).toBeNull();
      }
      expect(reportMessageToSentry).not.toHaveBeenCalled();
    });

    test('only accepts remote http(s) images or inline PNG/JPEG images', async () => {
      const localFile = path.resolve('public/static/images/giftcard.png');
      for (const value of [
        './public/static/images/giftcard.png',
        'public/static/images/giftcard.png',
        localFile,
        pathToFileURL(localFile).href,
        'ftp://example.com/logo.png',
        'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
        `data:image/gif;base64,${png.toString('base64')}`,
      ]) {
        expect(await loadEmbeddedImage(value)).toBeNull();
        expectRejectionReported('unsupported-source');
      }
      expect(reportMessageToSentry).toHaveBeenCalledTimes(7);
    });

    test('accepts inline PNG images', async () => {
      expect(await loadEmbeddedImage(pngDataUrl)).toBe(pngDataUrl);
      expect(reportMessageToSentry).not.toHaveBeenCalled();
    });

    test('rejects inline images whose content is not a PNG or JPEG', async () => {
      const dataUrl = `data:image/png;base64,${Buffer.from(svg).toString('base64')}`;
      expect(await loadEmbeddedImage(dataUrl)).toBeNull();
      expectRejectionReported('unsupported-format', { src: `${dataUrl.slice(0, 32)}...`, srcLength: dataUrl.length });
    });

    test('downloads remote PNG and JPEG images as data URLs', async () => {
      nock('https://example.com')
        .get('/signature.png')
        .reply(200, png, { 'Content-Type': 'image/png' })
        .get('/signature.jpg')
        .reply(200, jpeg, { 'Content-Type': 'image/jpeg' });
      expect(await loadEmbeddedImage('https://example.com/signature.png')).toBe(pngDataUrl);
      expect(await loadEmbeddedImage('https://example.com/signature.jpg')).toBe(
        `data:image/jpeg;base64,${jpeg.toString('base64')}`,
      );
    });

    test('uses the file content rather than the declared content type', async () => {
      nock('https://example.com')
        .get('/signature')
        .reply(200, png, { 'Content-Type': 'application/octet-stream' })
        .get('/signature.png')
        .reply(200, svg, { 'Content-Type': 'image/png' });
      expect(await loadEmbeddedImage('https://example.com/signature')).toBe(pngDataUrl);
      expect(await loadEmbeddedImage('https://example.com/signature.png')).toBeNull();
      expectRejectionReported('unsupported-format', { src: 'https://example.com/signature.png' });
    });

    test('rejects remote SVG images', async () => {
      nock('https://example.com').get('/signature.svg').reply(200, svg, { 'Content-Type': 'image/svg+xml' });
      expect(await loadEmbeddedImage('https://example.com/signature.svg')).toBeNull();
      expectRejectionReported('unsupported-format', { size: svg.length });
    });

    test('rejects images that are too large', async () => {
      const largePng = Buffer.concat([png, Buffer.alloc(MAX_EMBEDDED_IMAGE_SIZE_BYTES)]);
      nock('https://example.com')
        .get('/large.png')
        .reply(200, largePng, { 'Content-Type': 'image/png', 'Content-Length': String(largePng.length) })
        .get('/large-stream.png')
        .reply(200, () => Readable.from([png, Buffer.alloc(MAX_EMBEDDED_IMAGE_SIZE_BYTES)]), {
          'Content-Type': 'image/png',
        });
      expect(await loadEmbeddedImage('https://example.com/large.png')).toBeNull();
      expect(await loadEmbeddedImage('https://example.com/large-stream.png')).toBeNull();
      expect(await loadEmbeddedImage(`data:image/png;base64,${largePng.toString('base64')}`)).toBeNull();
      expect(reportMessageToSentry).toHaveBeenCalledTimes(3);
      expectRejectionReported('too-large', { maxSize: MAX_EMBEDDED_IMAGE_SIZE_BYTES });
    });

    test('returns null when the image cannot be fetched', async () => {
      nock('https://example.com').get('/missing.png').reply(404).get('/error.png').replyWithError('socket hang up');
      expect(await loadEmbeddedImage('https://example.com/missing.png')).toBeNull();
      expectRejectionReported('download-failed', { status: 404 });
      expect(await loadEmbeddedImage('https://example.com/error.png')).toBeNull();
      expect(reportErrorToSentry).toHaveBeenCalledWith(expect.any(Error), {
        severity: 'warning',
        tags: { feature: 'pdf-images', reason: 'download-failed' },
        extra: expect.objectContaining({ src: 'https://example.com/error.png' }),
      });
    });
  });
});
