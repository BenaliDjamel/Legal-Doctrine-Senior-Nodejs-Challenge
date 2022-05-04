import { TextId } from "../Domain/TextId";
import { TextStatus } from "../Domain/Types/TextStatus";
import { TextContent } from "../Domain/Types/TextContent";

export class CreateTextRequest {
  constructor(
    public id: TextId,
    public content: TextContent,
    public status: TextStatus
  ) {}
}
