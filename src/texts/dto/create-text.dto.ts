import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TextStatus } from '../types/textStatus';
import { TextContent } from '../types/textContent';

export class CreateTextDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TextContent)
  content: TextContent;

  @IsEnum(TextStatus)
  @IsOptional()
  status: string;
}
