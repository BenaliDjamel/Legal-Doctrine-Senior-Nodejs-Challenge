export function mostOccurrentWord(
  map: Map<string, { wordCount: number; language: string }>,
) {
  let mostOccurrent = {
    word: '',
    wordCount: 0,
    language: '',
  };

  for (const [word, data] of map) {
    if (data.wordCount > mostOccurrent.wordCount) {
      mostOccurrent.wordCount = data.wordCount;
      mostOccurrent.word = word;
      mostOccurrent.language = data.language;
    }
  }
  return mostOccurrent;
}
