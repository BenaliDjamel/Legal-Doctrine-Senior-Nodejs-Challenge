import {
  Get,
  Controller,
  Post,
  Body,
  BadRequestException,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Query,
  Put,
  Param,
} from '@nestjs/common';
import { Text } from './schemas/text.schema';
import { TextsService } from './texts.service';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { SupportedLanguages } from './types/languages';

@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createTextDto: CreateTextDto,
  ): Promise<Text> {
    const text = await this.textsService.create(createTextDto);
    if (!text) {
      throw new BadRequestException();
    }
    return text;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async all(
    @Query('page') pageNumber,
    @Query('limit') limit = 10,
  ): Promise<Text[]> {
    return await this.textsService.findAll({ pageNumber, limit });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTextDto: UpdateTextDto,
  ): Promise<Text> {
    return await this.textsService.update(id, updateTextDto);
  }

  @Get(':id/count')
  @HttpCode(HttpStatus.OK)
  async countWordsInText(@Param('id') id: string) {
    return await this.textsService.countWordsInText(id);
  }

  @Get(':id/count/:language')
  @HttpCode(HttpStatus.OK)
  async countWordsInTextByLanguage(
    @Param('id') id: string,
    @Param('language') lang: SupportedLanguages,
  ) {
    return await this.textsService.countWordsInTextByLanguage(id, lang);
  }

  @Get('mostOccurent')
  @HttpCode(HttpStatus.OK)
  async mostOccurentWord() {
    return this.textsService.mostOccurrentWordJsVersion();
    //return this.textsService.mostOccurentWordMongodbVersion()
  }

  @Put(':id/submit')
  @HttpCode(HttpStatus.OK)
  async sumbitTextForReview(@Param('id') id: string): Promise<Text> {
    return await this.textsService.sumbitTextForReview(id);
  }

  @Put(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approveText(@Param('id') id: string): Promise<Text> {
    return await this.textsService.approveText(id);
  }

  @Put(':id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectText(@Param('id') id: string): Promise<Text> {
    return await this.textsService.rejectText(id);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(@Query('q') q: string) {
    return await this.textsService.search(q);
  }
}
