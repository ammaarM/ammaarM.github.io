export function safeParseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('Failed to parse JSON content. Using fallback.', error);
    return fallback;
  }
}

export function stripFrontMatter(markdown: string): string {
  if (!markdown) return '';
  return markdown.replace(/^---[\s\S]*?---/u, '').trim();
}
