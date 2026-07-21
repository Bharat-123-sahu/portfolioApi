import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

import { connectToMongoDB } from './config/database.config';

async function bootstrap() {
  await connectToMongoDB();


const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.useStaticAssets(join(process.cwd(), 'uploads'), {
  prefix: '/uploads',
});
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('Portfolio CMS REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 5000);

  console.log(`🚀 Server : http://localhost:${process.env.PORT || 5000}`);

  console.log(`📘 Swagger : http://localhost:${process.env.PORT || 5000}/docs`);
}

bootstrap();
