/**
 * Shared regex-literal escaper.
 *
 * One copy, because the escape set is a correctness boundary rather than a
 * formatting nicety. Every caller feeds the result into `new RegExp(...)`
 * built from a token it did not choose, so a character class that is right in
 * one copy and stale in another silently changes which strings a guard
 * matches. That failure is invisible at the call site: the wrong pattern is
 * still a *valid* regex, it just matches (or refuses) a token its sibling
 * handles the other way.
 *
 * `escape-regexp.test.ts` beside this file is the assertion that set is what
 * it claims to be. No call site asserts it: most of them are guards whose
 * matching behaviour depends on it, and a guard that matches the wrong set
 * still passes its own suite.
 */

/**
 * `value` with every regex metacharacter escaped, safe to interpolate into a
 * pattern as a literal.
 *
 * `*` is escaped along with the rest: a caller compiling a literal path would
 * otherwise have it silently rewritten into a glob. `[](){}^$|` are escaped
 * both to keep them literal and because leaving `[` unescaped opens a
 * character class the input never closes, which makes `new RegExp` throw
 * rather than mismatch.
 *
 * `-` is deliberately absent. It is a metacharacter only inside a character
 * class, and no caller interpolates into one; a caller that needs hyphen
 * adjacency handled bounds it with its own token boundaries instead.
 */
// Hoisted rather than written inline: a literal in the function body
// constructs a fresh RegExp on every call. Sharing one `g`-flagged object
// across callers is safe because `replaceAll` resets `lastIndex` before it
// matches, so no call can observe another's scan position.
const METACHARACTERS = /[.*+?^${}()|[\]\\]/g;

export const escapeRegExp = (value: string): string =>
  value.replaceAll(METACHARACTERS, String.raw`\$&`);
