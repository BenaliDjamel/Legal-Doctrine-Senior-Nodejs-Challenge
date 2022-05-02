import { TextContent } from './types/textContent';
import { NotFoundException } from '@nestjs/common';
import { SupportedLanguages } from './types/languages';
import { countWords } from './helpers/countsWordsInText';
import { mostOccurrentWord } from './helpers/mostWordOccurrent';
import { countWordOccurrence } from './helpers/countWordOccurrence';
import { countWordsByLanguage } from './helpers/countsWordsInTextBylang';
import { checkSupportedLanguages } from './helpers/checkSupportedLanguages';
import { concatinateTextsByLanguage } from './helpers/concatinateTextsByLanguage';

describe('Text helper functions', () => {
  it('it should throw exception for unsupported language', () => {
    expect(() => {
      checkSupportedLanguages('bn' as SupportedLanguages);
    }).toThrow(NotFoundException);
  });

  it('it should concatinate texts by language', async () => {
    const texts = [
      {
        content: {
          ar: 'سلام',
          fr: 'salut',
          en: 'hello',
        },
      },
      {
        content: {
          ar: 'تجريب',
          fr: 'test',
          en: 'test',
        },
      },
    ];
    const obj = await concatinateTextsByLanguage(texts);

    expect('salut test').toEqual(obj.fullFrenchText);
    expect('hello test').toEqual(obj.fullEnglishText);
    expect('سلام تجريب').toEqual(obj.fullArabicText);
  });

  it('it should count words for each language in text', () => {
    const data: TextContent = {
      ar: 'سلام عليكم',
      fr: ' salut popo ',
      en: 'hello popo momo',
    };

    const result: {
      arabicWords: number;
      frenchWords: number;
      englishWords: number;
      totalWords: number;
    } = countWords(data);

    expect(2).toEqual(result.arabicWords);
    expect(2).toEqual(result.frenchWords);
    expect(3).toEqual(result.englishWords);
    expect(7).toEqual(result.totalWords);
  });

  it('it should count words for a given language in text', () => {
    const data: TextContent = {
      ar: 'سلام عليكم',
      fr: ' salut popo ',
      en: 'hello popo momo',
    };

    const result = countWordsByLanguage(data, 'ar' as SupportedLanguages);

    expect({ ar: 2 }).toEqual(result);
  });

  it('it should count words occurrence in a given text', () => {
    const text = 'this is a test test text';

    const result = countWordOccurrence(text, 'en');

    expect(2).toEqual(result.get('test').wordCount);
  });

  it('it should count most occurrent word  in a all texts', () => {
    const map = new Map();
    map.set('this', { wordCount: 4, language: 'en' });
    map.set('good', { wordCount: 1, language: 'en' });
    map.set('جميل', { wordCount: 7, language: 'ar' });

    const result = mostOccurrentWord(map);

    expect('جميل').toEqual(result.word);
    expect(7).toEqual(result.wordCount);
    expect('ar').toEqual(result.language);
  });
});
