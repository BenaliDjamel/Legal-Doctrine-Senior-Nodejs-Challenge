import { Text } from "../Domain/Text";
import { UpdateTextRequest } from "./UpdateTextRequest";
import { TextRepository } from "../Domain/TextRepository";

export class UpdateText {
  constructor(private textRepository: TextRepository) {}

  execute(updateTextRequest: UpdateTextRequest): Text {

    let text = this.textRepository.ofId( updateTextRequest.id.id());

    if(!text) {
      throw new Error('Text not found')
    }

     text =  new Text(
      updateTextRequest.id,
      updateTextRequest.content,
      updateTextRequest.status
    );
    return this.textRepository.update(text);
  }
}
