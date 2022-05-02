import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { SupportedLanguages } from './types/languages';
import { countWords } from './helpers/countsWordsInText';
import { Text, TextDocument } from './schemas/text.schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as FuzzySearch from 'fuzzy-search';
import { TextStatus } from './types/textStatus';
import { mostOccurrentWord } from './helpers/mostWordOccurrent';
import { countWordOccurrence } from './helpers/countWordOccurrence';
import { countWordsByLanguage } from './helpers/countsWordsInTextBylang';
import { checkSupportedLanguages } from './helpers/checkSupportedLanguages';
import { concatinateTextsByLanguage } from './helpers/concatinateTextsByLanguage';

@Injectable()
export class TextsService {
  constructor(@InjectModel(Text.name) private textModel: Model<TextDocument>) {}

  async create(createTextDto: CreateTextDto): Promise<Text> {
    createTextDto.status = TextStatus.Draft;
    const createdText = new this.textModel(createTextDto);
    return createdText.save();
  }

  async findAll(query: { pageNumber: number; limit: number }): Promise<Text[]> {
    // await this.textModel.deleteMany({});
    const { pageNumber = 1, limit = 5 } = query;
    let texts = await this.textModel.aggregate([
      { $skip: (pageNumber - 1) * limit },
      { $limit: limit * 1 },
    ]);

    return texts;
  }

  async update(id: string, updateTextDto: UpdateTextDto): Promise<Text> {
    const text = await this.textModel.findById(id);

    if (!text) {
      throw new NotFoundException('Text not found');
    }

    text.content = updateTextDto.content;
    text.status = TextStatus.Draft;

    return text.save();
  }

  async countWordsInText(id: string) {
    const text = await this.textModel.findById(id);

    if (!text) {
      throw new NotFoundException('Text not found');
    }

    return countWords(text.content);
  }

  async countWordsInTextByLanguage(id: string, lang: SupportedLanguages) {
    const text = await this.textModel.findById(id);

    if (!text) {
      throw new NotFoundException('Text not found');
    }

    checkSupportedLanguages(lang);

    return countWordsByLanguage(text.content, lang);
  }
  /**
   * concatinate texts by language
   * count word occurrence for each language
   * merge word occurrence for all languages, then compare the most occurrente word
   */

  async mostOccurrentWordJsVersion() {
    const texts = await this.textModel.find();

    if (!texts.length) {
      throw new NotFoundException('Cannot operate on empty dataset');
    }

    const { fullArabicText, fullFrenchText, fullEnglishText } =
      await concatinateTextsByLanguage(texts);

    const arabicWordsOccurrenceMap = countWordOccurrence(fullArabicText, 'ar');
    const frenchWordsOccurrenceMap = countWordOccurrence(fullFrenchText, 'fr');
    const englishWordsOccurrenceMap = countWordOccurrence(
      fullEnglishText,
      'en',
    );

    const map = new Map([
      ...arabicWordsOccurrenceMap,
      ...frenchWordsOccurrenceMap,
      ...englishWordsOccurrenceMap,
    ]);

    return mostOccurrentWord(map);
  }

  async mostOccurentWordMongodbVersion() {
    /*  let tmp = await this.textModel.aggregate([
      { $project: { word: { $split: ['$content.en', ' '] } } },
      { $unwind: '$word' },
      { $group: { _id: '$word', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    return tmp.pop(); */
  }

  async sumbitTextForReview(id: string): Promise<Text> {
    const text = await this.textModel.findById(id);

    if (!text) {
      throw new NotFoundException('Text not found');
    }

    if (
      ![TextStatus.Draft, TextStatus.Rejected].includes(
        text.status as TextStatus,
      )
    ) {
      throw new BadRequestException();
    }

    text.status = TextStatus.Submitted;
    return text.save();
  }

  async approveText(id: string): Promise<Text> {
    const text = await this.textModel.findById(id);

    if (!text) {
      throw new NotFoundException('Text not found');
    }

    if (text.status !== TextStatus.Submitted) {
      throw new BadRequestException();
    }

    text.status = TextStatus.Approved;
    return text.save();
  }

  async rejectText(id: string): Promise<Text> {
    const text = await this.textModel.findById(id);

    if (!text) {
      throw new NotFoundException('Text not found');
    }

    if (text.status !== TextStatus.Submitted) {
      throw new BadRequestException();
    }

    text.status = TextStatus.Rejected;
    return text.save();
  }

  async search(query: string) {
    const texts = await this.textModel.find();
    const searchIn = ['content.ar', 'content.fr', 'content.en', 'status'];

    const searcher = new FuzzySearch(texts, searchIn, {
      caseSensitive: false,
    });

    const result = searcher.search(query?.trim());

    return result.length
      ? result
      : {
          message: 'No match found',
          result: [],
        };
  }
}
