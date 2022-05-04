import { TextId } from "./TextId";
import { TextStatus } from "./Types/TextStatus";
import { TextContent } from "./Types/TextContent";
import { SupportedLanguages } from "./Types/SupportedLanguages";

export class Text {
  constructor(
    private textId: TextId,
    private textContent: TextContent,
    private textStatus: TextStatus = TextStatus.Draft
  ) {}

  countWordsInText() {
    const arabicWords =
      this.textContent.ar?.match(/([^\u0000-\u007F]|\w)+/g).length ?? 0;
    const frenchWords =
      this.textContent.fr?.match(/([^\u0000-\u007F]|\w)+/g).length ?? 0;
    const englishWords =
      this.textContent.en?.match(/([^\u0000-\u007F]|\w)+/g).length ?? 0;

    const totalWords = arabicWords + frenchWords + englishWords;

    return {
      arabicWords,
      frenchWords,
      englishWords,
      totalWords,
    };
  }

  countWordsByLanguage(lang: SupportedLanguages) {

    if(![SupportedLanguages.AR, SupportedLanguages.FR, SupportedLanguages.EN].includes(lang)) {
      throw new Error('Language not supported')
    }

    const Words =
      this.textContent[lang]?.match(/([^\u0000-\u007F]|\w)+/g).length ?? 0;

    return {
      [lang]: Words,
    };
  }

  id(): string {
    return this.textId.id();
  }

  content(): TextContent {
    return this.textContent;
  }

  status(): TextStatus {
    return this.textStatus;
  }
}
