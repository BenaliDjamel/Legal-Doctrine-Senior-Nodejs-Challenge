import { Text } from "../../src/Domain/Text";
import { TextId } from "../../src/Domain/TextId";
import { TextStatus } from "../../src/Domain/Types/TextStatus";
import { TextContent } from "../../src/Domain/Types/TextContent";
import { SupportedLanguages } from "../../src/Domain/Types/SupportedLanguages";

let content: TextContent;
let text: Text;

beforeAll(() => {
  content = {
    ar: "السلام عليكم",
    fr: "salut a tout",
    en: "hello world",
  } as TextContent;

  text = new Text(new TextId("azerty12345"), content, TextStatus.Draft);
});

describe("Text class ", () => {
  it("should create a Text instance", () => {
    expect(text).toBeInstanceOf(Text);
  });

  it("should count words in a given text", () => {
    expect(text.countWordsInText().arabicWords).toEqual(2);
    expect(text.countWordsInText().frenchWords).toEqual(3);
    expect(text.countWordsInText().englishWords).toEqual(2);
    expect(text.countWordsInText().totalWords).toEqual(7);
  });

  it("should count words in a given text by language", () => {
    expect(text.countWordsByLanguage(SupportedLanguages.AR).ar).toEqual(2);
    expect(text.countWordsByLanguage(SupportedLanguages.FR).fr).toEqual(3);
    expect(text.countWordsByLanguage(SupportedLanguages.EN).en).toEqual(2);
  });
});
