import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // This will remove any properties that are not in the DTO
      transform: true, // This will transform the incoming data to the DTO type
      transformOptions: {
        enableImplicitConversion: true, // This will convert the incoming data to the type specified in the DTO
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
