import { describe, expect, test } from 'vitest';
import { allCharsValid } from '../../server/lib/string-utils.js';

describe('allCharsValid', () => {
  const asciiSet = new Set(Array.from({ length: 128 }, (_, i) => i));

  test('returns true when all characters are in the set', () => {
    expect(allCharsValid('Hello World', asciiSet)).toBe(true);
  });

  test('returns false for CJK characters', () => {
    expect(allCharsValid('Hello 中文', asciiSet)).toBe(false);
  });

  test('compares full code points for characters outside the BMP', () => {
    const emoji = '😀';
    expect(allCharsValid(emoji, asciiSet)).toBe(false);
    expect(allCharsValid(emoji, new Set([emoji.codePointAt(0)]))).toBe(true);
  });
});
