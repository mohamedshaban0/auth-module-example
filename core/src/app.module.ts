import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { APP_GUARD } from '@nestjs/core';

// import { CacheModule } from '@nestjs/cache-manager';
// import { redisStore } from 'cache-manager-redis-store';

import typeOrmConfig from '@config/typeorm.config';
import loggerConfig from '@config/logger.config';
import { JwtAuthStrategy } from '@common/strategies/jwt.strategy';
import { JwtAuthGuard } from '@common/guards/jwt.guard';

import configuration from './config';

import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';

const configOptions: ConfigModuleOptions = {
    envFilePath: [`.env.development`],
    load: configuration,
};

@Module({
    imports: [
        ConfigModule.forRoot(configOptions),
        TypeOrmModule.forRoot(typeOrmConfig),
        WinstonModule.forRoot(loggerConfig),
        UsersModule,
        ProductsModule,
    ],
    providers: [
        JwtAuthStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
