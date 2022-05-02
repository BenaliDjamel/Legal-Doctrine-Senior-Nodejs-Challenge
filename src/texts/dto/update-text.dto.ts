import { Type } from 'class-transformer';
import { TextContent } from '../types/textContent';
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';

export class UpdateTextDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TextContent)
  content: TextContent;
}
