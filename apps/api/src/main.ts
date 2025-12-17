import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ UNLOCK THE DOOR (Allow React to talk to NestJS)
  app.enableCors(); 
  
  await app.listen(3000); // We can stick to 3000 specifically for now
}
bootstrap();