import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as csurf from 'csurf';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Features
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://spontaneous-cendol-881628.netlify.app',
    ],
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration

  const config = new DocumentBuilder()
    .setTitle('EasyStory API')
    .setDescription('EasyStory API Documentation')
    .setVersion('1.0')
    .addTag('EasyStory')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Security Configuration
  //app.use(helmet());
  //app.use(csurf());

  app.use(cookieParser());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
