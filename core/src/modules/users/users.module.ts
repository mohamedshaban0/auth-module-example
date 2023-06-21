import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController, UsersController } from './controllers';
import { AuthService, UsersService } from './services';

import { User } from './entities/user.entity';

import { RefreshJwtAuthStrategy } from './strategies';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([User])],
    controllers: [AuthController, UsersController],
    providers: [AuthService, UsersService, JwtService, RefreshJwtAuthStrategy],
})
export class UsersModule {}
