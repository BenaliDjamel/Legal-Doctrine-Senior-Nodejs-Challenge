import { Text } from "../../src/Domain/Text";
import { TextId } from "../../src/Domain/TextId";
import { CreateText } from "../../src/Application/CreateText";
import { TextStatus } from "../../src/Domain/Types/TextStatus";
import { TextContent } from "../../src/Domain/Types/TextContent";
import { TextRepository } from "../../src/Domain/TextRepository";
import { CreateTextRequest } from "../../src/Application/CreateTextRequest";
import { InMemoryRepository } from "../../src/Infrastructure/Repositories/InMemoryTextRepository";

let textRepository: TextRepository;
let createTextService: CreateText;

beforeAll(() => {
  textRepository = new InMemoryRepository();
  createTextService = new CreateText(textRepository);
});

describe("Create a Text", () => {
  it("should create a text", () => {
    const content = {
      ar: "السلام عليكم",
      fr: "salut a tout",
      en: "hello world",
    } as TextContent;

    const createTextRequest = new CreateTextRequest(
      new TextId("azerty12345"),
      content,
      TextStatus.Draft
    );

    expect(createTextService.execute(createTextRequest)).toEqual(
      new Text(new TextId("azerty12345"), content, TextStatus.Draft)
    );
  });
});
