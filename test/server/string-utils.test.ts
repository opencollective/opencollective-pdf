import { describe, expect, test } from 'vitest';
import { allCharsValid, allStringsCharsValid } from '../../server/lib/string-utils.js';

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

describe('allStringsCharsValid', () => {
  const asciiSet = new Set(Array.from({ length: 128 }, (_, i) => i));

  test('checks nested values and keys', () => {
    expect(allStringsCharsValid({ a: 'Hello', b: [1, true, null, { c: 'World' }] }, asciiSet)).toBe(true);
    expect(allStringsCharsValid({ a: { b: ['Hello', '中文'] } }, asciiSet)).toBe(false);
    expect(allStringsCharsValid({ 中文: 'Hello' }, asciiSet)).toBe(false);
  });

  test('sees characters that JSON.stringify escapes', () => {
    const printableAscii = new Set(Array.from({ length: 95 }, (_, i) => i + 32));
    for (const char of ['\u0001', '\ud800']) {
      expect(allCharsValid(JSON.stringify({ a: char }), printableAscii)).toBe(true);
      expect(allStringsCharsValid({ a: char }, printableAscii)).toBe(false);
    }
  });
});
