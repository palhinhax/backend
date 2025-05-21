import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter'; // Importe o filtro

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  app.enableCors({
    origin: 'http://localhost:5173', // URL do seu front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Accept, Authorization', // Cabeçalhos permitidos
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
