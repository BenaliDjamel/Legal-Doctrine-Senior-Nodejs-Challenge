import { Text } from "../../src/Domain/Text";
import { TextId } from "../../src/Domain/TextId";
import { CreateText } from "../../src/Application/CreateText";
import { TextStatus } from "../../src/Domain/Types/TextStatus";
import { TextContent } from "../../src/Domain/Types/TextContent";
import { TextRepository } from "../../src/Domain/TextRepository";
import { InMemoryRepository } from "../../src/Infrastructure/Repositories/InMemoryTextRepository";
import { UpdateText } from "../../src/Application/UpdateText";
import { UpdateTextRequest } from "../../src/Application/UpdateTextRequest";
import { CreateTextRequest } from "../../src/Application/CreateTextRequest";

let textRepository: TextRepository;
let updateTextService: UpdateText;
let createTextService: CreateText;

beforeAll(() => {
  
  textRepository = new InMemoryRepository();
  createTextService = new CreateText(textRepository);
  updateTextService = new UpdateText(textRepository);

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

  createTextService.execute(createTextRequest);
});

describe("Create a Text", () => {

  it("should create a text", () => {
    const content = {
      ar: "2السلام عليكم",
      fr: "salut a tout2",
      en: "hello world2",
    } as TextContent;

    const updateTextRequest = new UpdateTextRequest(
      new TextId("azerty12345"),
      content,
      TextStatus.Draft
    );

    expect(updateTextService.execute(updateTextRequest)).toEqual(
      new Text(new TextId("azerty12345"), content, TextStatus.Draft)
    );

    expect(updateTextService.execute(updateTextRequest).content().en).toEqual(
      "hello world2"
    ); 
  });
});
