import { TextContent } from '../types/textContent';

export function countWords(content: TextContent) {
  const arabicWords = content.ar?.match(/([^\u0000-\u007F]|\w)+/g).length ?? 0;
  const frenchWords = content.fr?.match(/([^\u0000-\u007F]|\w)+/g).length ?? 0;
  const englishWords = content.en?.match(/([^\u0000-\u007F]|\w)+/g).length ?? 0;

  const totalWords = arabicWords + frenchWords + englishWords;

  return {
    arabicWords,
    frenchWords,
    englishWords,
    totalWords,
  };
}
