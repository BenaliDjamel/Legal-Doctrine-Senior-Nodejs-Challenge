import { Text } from "../../Domain/Text";
import { TextRepository } from "../../Domain/TextRepository";

export class InMemoryRepository implements TextRepository {
  private map: Map<string, Text>;

  constructor() {
    this.map = new Map();
  }

  ofId(id: string): Text {
    return this.map.get(id);
  }

  create(text: Text): Text {
    this.map.set(text.id(), text);
    return this.map.get(text.id());
  }

  update(updatedtext: Text): Text {
    this.map.set(updatedtext.id(), updatedtext);
    return this.map.get(updatedtext.id());
  }
}
