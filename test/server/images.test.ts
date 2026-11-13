import { expect, test, describe, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { getSvgStructureStats, loadSafeImage, MAX_SVG_DEPTH, resizeImage } from '../../server/lib/images.js';

const buildNestedSvg = (depth: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">${'<g>'.repeat(depth)}<rect width="1" height="1"/>${'</g>'.repeat(depth)}</svg>`;

describe('lib/images', () => {
  describe('getSvgStructureStats', () => {
    test('computes nesting depth and element count', () => {
      expect(getSvgStructureStats(buildNestedSvg(3))).toEqual({ maxDepth: 4, elementsCount: 5 });
    });

    test('handles extremely deep SVGs without overflowing the stack', () => {
      expect(getSvgStructureStats(buildNestedSvg(100_000)).maxDepth).toBe(100_001);
    });

    test('ignores comments', () => {
      expect(getSvgStructureStats('<svg><!-- <g><g><g> --></svg>').maxDepth).toBe(1);
    });
  });

  describe('resizeImage', () => {
    test('keeps data URLs untouched', () => {
      expect(resizeImage('data:image/png;base64,AAAA', { height: 200 })).toBe('data:image/png;base64,AAAA');
    });
  });

  describe('loadSafeImage', () => {
    beforeEach(() => {
      nock.disableNetConnect();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.enableNetConnect();
    });

    test('returns null for empty or invalid sources', async () => {
      expect(await loadSafeImage(null)).toBeNull();
      expect(await loadSafeImage('ftp://example.com/logo.png')).toBeNull();
    });

    test('returns local paths untouched', async () => {
      expect(await loadSafeImage('./public/static/images/giftcard.png')).toBe('./public/static/images/giftcard.png');
    });

    test('converts a valid remote SVG to a data URL', async () => {
      const svg = buildNestedSvg(5);
      nock('https://example.com').get('/logo.svg').reply(200, svg, { 'Content-Type': 'image/svg+xml' });
      const result = await loadSafeImage('https://example.com/logo.svg');
      expect(result).toBe(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
    });

    test('rejects deeply nested SVGs', async () => {
      nock('https://example.com')
        .get('/deep.svg')
        .reply(200, buildNestedSvg(MAX_SVG_DEPTH * 100), { 'Content-Type': 'image/svg+xml' });
      expect(await loadSafeImage('https://example.com/deep.svg')).toBeNull();
    });

    test('detects SVGs served with a misleading content type', async () => {
      nock('https://example.com')
        .get('/deep.png')
        .reply(200, buildNestedSvg(MAX_SVG_DEPTH * 100), { 'Content-Type': 'image/png' });
      expect(await loadSafeImage('https://example.com/deep.png')).toBeNull();
    });

    test('rejects deeply nested SVG data URLs', async () => {
      const dataUrl = `data:image/svg+xml;base64,${Buffer.from(buildNestedSvg(MAX_SVG_DEPTH * 100)).toString('base64')}`;
      expect(await loadSafeImage(dataUrl)).toBeNull();
    });

    test('returns null when the image cannot be fetched', async () => {
      nock('https://example.com').get('/missing.png').reply(404);
      expect(await loadSafeImage('https://example.com/missing.png')).toBeNull();
    });
  });
});
