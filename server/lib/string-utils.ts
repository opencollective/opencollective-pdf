/**
 * Check if all characters in a string are included in a set of valid characters (as unicode code points).
 */
export function allCharsValid(str: string, validChars: Set<number>) {
  for (const char of str) {
    if (!validChars.has(char.codePointAt(0))) {
      return false;
    }
  }
  return true;
}
