/**
 * Check if all characters in a string are included in a set of valid characters (as unicode code points).
 */
export function allCharsValid(str: string, validChars: Set<number>) {
  for (const char of str) {
    // A character taken from a string always has a code point
    if (!validChars.has(char.codePointAt(0)!)) {
      return false;
    }
  }
  return true;
}

/**
 * Check if all characters of every string (object keys included) in a JSON-like value are included in a set of
 * valid characters. Unlike checking `JSON.stringify(value)`, this sees characters that JSON escapes
 * (control characters, lone surrogates).
 */
export function allStringsCharsValid(value: unknown, validChars: Set<number>): boolean {
  if (typeof value === 'string') {
    return allCharsValid(value, validChars);
  } else if (Array.isArray(value)) {
    return value.every(item => allStringsCharsValid(item, validChars));
  } else if (value && typeof value === 'object') {
    return Object.entries(value).every(
      ([key, item]) => allCharsValid(key, validChars) && allStringsCharsValid(item, validChars),
    );
  }
  return true;
}
