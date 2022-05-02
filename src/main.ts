import helmet from 'helmet';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
