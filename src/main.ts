import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  ConfigModule.forRoot();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
