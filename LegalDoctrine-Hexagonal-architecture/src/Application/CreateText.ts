import { Text } from "../Domain/Text";
import { CreateTextRequest } from "./CreateTextRequest";
import { TextRepository } from "../Domain/TextRepository";

export class CreateText {
  constructor(private textRepository: TextRepository) {}

  execute(createTextRequest: CreateTextRequest): Text {
    const text = new Text(
      createTextRequest.id,
      createTextRequest.content,
      createTextRequest.status
    );
    return this.textRepository.create(text);
  }
}
