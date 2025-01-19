import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CosmosExceptionFilter } from './database/cosmosExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CosmosExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
