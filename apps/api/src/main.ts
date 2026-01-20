import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-expection.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');

  //  UNLOCK THE DOOR (Allow React to talk to NestJS)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:6000',
    credential: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Naaji pitch api')
    .setDescription('Api for Naaji pitch')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port); // sticking to 3000 specifically for now

  console.log(`App is running on http://localhost:${port}/api`);
  console.log(
    `Api documentation is running on http://localhost:${port}/api/docs`,
  );
}
bootstrap();
