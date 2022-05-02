import { TextContent } from '../types/textContent';
import { SupportedLanguages } from '../types/languages';

export function countWordsByLanguage(
  content: TextContent,
  lang: SupportedLanguages,
) {
  const Words = content[lang]?.match(/([^\u0000-\u007F]|\w)+/g).length ?? 0;

  return {
    [lang]: Words,
  };
}
