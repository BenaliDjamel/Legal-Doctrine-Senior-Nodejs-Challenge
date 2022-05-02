export function countWordOccurrence(text: string, language: string) {
  const map: Map<string, { wordCount: number; language: string }> = new Map();

  for (const word of text.match(/([^\u0000-\u007F]|\w)+/g)) {
    if (map.has(word)) {
      map.set(word, {
        wordCount: map.get(word).wordCount + 1,
        language,
      });
    } else {
      map.set(word, { wordCount: 1, language });
    }
  }

  return map;
}
