import { describe, expect, test } from 'vitest';
import { getInvalidSvgReason, sanitizeImageUrl } from '../../server/lib/svg.js';

const svg = (viewBox: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><rect/></svg>`;
const toDataUrl = (content: string) => `data:image/svg+xml;base64,${Buffer.from(content).toString('base64')}`;

describe('server/lib/svg', () => {
  describe('getInvalidSvgReason', () => {
    test('accepts valid SVGs', () => {
      expect(getInvalidSvgReason(svg('0 0 100 50'))).toBeNull();
      expect(getInvalidSvgReason(svg('-10,-10,20,20'))).toBeNull();
      expect(getInvalidSvgReason('<svg width="10" height="10"></svg>')).toBeNull();
      expect(getInvalidSvgReason('not an svg')).toBeNull();
    });

    test('rejects SVGs with a viewBox that would break the renderer', () => {
      expect(getInvalidSvgReason(svg('0 0 10 Infinity'))).toMatch(/invalid viewBox/);
      expect(getInvalidSvgReason(svg('0 0 NaN 10'))).toMatch(/invalid viewBox/);
      expect(getInvalidSvgReason(svg('0 0 10 0'))).toMatch(/invalid viewBox/);
      expect(getInvalidSvgReason(svg('0 0 -10 10'))).toMatch(/invalid viewBox/);
      expect(getInvalidSvgReason(svg('0 0 1e400 10'))).toMatch(/invalid viewBox/);
      expect(getInvalidSvgReason(svg('0 0 10 1e-320'))).toMatch(/invalid viewBox/);
    });
  });

  describe('sanitizeImageUrl', () => {
    test('returns empty and local values unchanged', async () => {
      expect(await sanitizeImageUrl(null)).toBeNull();
      expect(await sanitizeImageUrl(undefined)).toBeUndefined();
      expect(await sanitizeImageUrl('./public/static/images/giftcard.png')).toBe('./public/static/images/giftcard.png');
    });

    test('checks base64 SVG data URLs', async () => {
      const valid = toDataUrl(svg('0 0 10 10'));
      expect(await sanitizeImageUrl(valid)).toBe(valid);
      expect(await sanitizeImageUrl(toDataUrl(svg('0 0 10 Infinity')))).toBeNull();
    });
  });
});
