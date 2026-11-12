/**
 * cmdk-style matching. Every character of the query must appear in order in
 * the label ("kbs" finds "Keyboard shortcuts"); keywords only match as plain
 * substrings so they can't produce noisy hits. Higher scores are better
 * matches; 0 means no match.
 */
export function fuzzyMatch(query: string, text: string): boolean {
  const needle = query.toLowerCase().replace(/\s+/g, "");
  if (!needle) return true;
  const haystack = text.toLowerCase();
  let from = 0;
  for (const char of needle) {
    const at = haystack.indexOf(char, from);
    if (at === -1) return false;
    from = at + 1;
  }
  return true;
}

export function scoreCommand(
  query: string,
  label: string,
  keywords = "",
): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const l = label.toLowerCase();
  if (l.startsWith(q)) return 4;
  if (l.includes(q)) return 3;
  if (fuzzyMatch(q, l)) return 2;
  if (keywords.toLowerCase().includes(q)) return 1;
  return 0;
}
