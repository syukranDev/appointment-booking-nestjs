import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    console.log('=====================================');
    console.log(' Environment Variables:');
    console.log('=====================================');
  
    console.log('== Database Configuration:');
    console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost (default)'}`);
    console.log(`   DB_PORT: ${process.env.DB_PORT || '5432 (default)'}`);
    console.log(`   DB_USERNAME: ${process.env.DB_USERNAME || 'postgres (default)'}`);
    console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***SET***' : 'NOT SET (default)'}`);
    console.log(`   DB_DATABASE: ${process.env.DB_DATABASE || 'hospital_booking (default)'}`);
    console.log('== JWT Configuration:');
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '***SET***' : 'NOT SET (using default)'}`);
    console.log('== Email Configuration:');
    console.log(`   GMAIL_USER: ${process.env.GMAIL_USER || 'NOT SET'}`);
    console.log(`   GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? '***SET***' : 'NOT SET'}`);
    console.log('== Application Configuration:');
    console.log(`   PORT: ${process.env.PORT || '3000 (default)'}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development (default)'}`);
    
    console.log('=====================================');
  
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  app.enableCors();
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
