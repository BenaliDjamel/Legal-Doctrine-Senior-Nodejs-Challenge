import { Document } from 'mongoose';
import { TextStatus } from '../types/textStatus';
import { TextContent } from '../types/textContent';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TextDocument = Text & Document;

@Schema()
export class Text {
  @Prop({ type: Object, required: true })
  content:TextContent;
  @Prop({
    type: String,
    required: true,
    enum: [
      TextStatus.Draft,
      TextStatus.Submitted,
      TextStatus.Rejected,
      TextStatus.Approved,
    ],
    default: TextStatus.Draft,
  })
  status: string;
}
export const TextSchema = SchemaFactory.createForClass(Text);
