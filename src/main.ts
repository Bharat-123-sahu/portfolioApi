import { NestFactory } from '@nestjs/core';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { join } from 'path';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware';
import { AppModule } from './app.module';

import { connectToMongoDB } from './config/database.config';
import {
  getAllowedOrigins,
  getNumberEnv,
  validateEnvironment,
} from './config/env.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  validateEnvironment();
  await connectToMongoDB();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = getNumberEnv('PORT', 5000);
  const allowedOrigins = getAllowedOrigins();

  app.set('trust proxy', 1);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['Content-Length'],
    maxAge: 86400,
    optionsSuccessStatus: 204,
  });
  app.use(
    helmet({
      hidePoweredBy: true,
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'],
          connectSrc: ["'self'"],
        },
      },
    }),
  );
  app.use(
    rateLimit({
      windowMs: getNumberEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
      limit: getNumberEnv('RATE_LIMIT_MAX', 100),
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      handler: (_request: Request, response: Response) => {
        response.status(HttpStatus.TOO_MANY_REQUESTS).json({
          success: false,
          message: 'Too many requests. Please try again later.',
          data: null,
        });
      },
      skip: (request) =>
        request.method === 'OPTIONS' || request.path.startsWith('/uploads'),
    }),
  );
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });
  const requestLogger = new RequestLoggingMiddleware();
  app.use(requestLogger.use.bind(requestLogger));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('Portfolio CMS REST API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description:
          'Enter JWT access token. Swagger sends Authorization: Bearer <token>.',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  logger.log(`Server: http://localhost:${port}`);
  logger.log(`Swagger: http://localhost:${port}/docs`);
}

void bootstrap();
