import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Security Hardening (Aegis)
    app.use(helmet());

    // API Global Prefix
    app.setGlobalPrefix('api');

    // Enable CORS with strict origin
    app.enableCors({
        origin: ['http://localhost:3000'], // Zero-G Frontend
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    // Global Validation Pipe (Strict DTOs)
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    // Global Exception Filter
    app.useGlobalFilters(new AllExceptionsFilter());

    // Global Transform Interceptor
    app.useGlobalInterceptors(new TransformInterceptor());

    // Swagger Configuration
    const config = new DocumentBuilder()
        .setTitle('Antigravity API')
        .setDescription('The indestructible core API for Zero-G')
        .setVersion('1.0')
        .addTag('Health')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3001, '0.0.0.0');
    console.log(`Antigravity Core running on: ${await app.getUrl()}`);
}
bootstrap();
