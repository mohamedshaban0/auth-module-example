import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        abortOnError: false,
        logger: false,
    });

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.setGlobalPrefix('api');

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            stopAtFirstError: true,
            validationError: {
                target: false,
                value: false,
            },
        }),
    );

    const configService = app.get(ConfigService);

    const port = configService.get('PORT');

    await app.listen(port);
}
bootstrap();
