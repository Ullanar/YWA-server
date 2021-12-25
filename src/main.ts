import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function start() {
  const PORT = process.env.PORT || 3006;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('YWA network')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .addTag('YWA')
    .build();

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
      'Content-Type',
      'Authorization, Content-Type, Access-Control-Allow-Origin, X-Requested-With',
    ],
    credentials: true,
  });

  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port  ${PORT}`));
}

start();
