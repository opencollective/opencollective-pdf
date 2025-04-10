/**
 * Check if all characters in a string are included in a set of valid characters.
 */
export function allCharsValid(str: string, validChars: Set<number>) {
  for (let i = 0; i < str.length; i++) {
    if (!validChars.has(str.charCodeAt(i))) {
      return false;
    }
  }
  return true;
}
