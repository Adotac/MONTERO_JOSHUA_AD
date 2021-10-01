import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
const DB_CRED = require("../mkey.json"); 
async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert(DB_CRED)
  }); 

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
