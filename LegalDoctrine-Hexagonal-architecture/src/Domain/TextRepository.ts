import { Text } from "./Text";

export interface TextRepository {
  ofId(id: string): Text;
  create(text: Text): Text;
  update(text: Text): Text;
}
