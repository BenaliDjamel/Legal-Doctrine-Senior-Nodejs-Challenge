import { NotFoundException } from '@nestjs/common';
import { SupportedLanguages } from '../types/languages';

export function checkSupportedLanguages(lang: SupportedLanguages) {
  const isLangSupported = Object.values(SupportedLanguages).includes(
    lang as SupportedLanguages,
  );

  if (!isLangSupported) {
    throw new NotFoundException('Language is not supported');
  }
}
