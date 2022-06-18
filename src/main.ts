import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as csurf from 'csurf';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Configuration
  app.use(helmet());
  app.use(csurf());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
