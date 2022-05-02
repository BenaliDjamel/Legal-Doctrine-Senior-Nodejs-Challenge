import { Module } from '@nestjs/common';
import { TextsService } from './texts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TextsController } from './texts.controller';
import { Text, TextSchema } from './schemas/text.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Text.name, schema: TextSchema }]),
  ],
  controllers: [TextsController],
  providers: [TextsService],
})
export class TextsModule {}
