import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,  // Удаляет поля, которых нет в DTO
    forbidNonWhitelisted: false,  // Изменено на false, чтобы разрешить дополнительные поля
  }));
  
  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(24110);
  console.log('Application is running on: http://localhost:24110');
}
bootstrap();