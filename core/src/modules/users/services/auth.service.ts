import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { JwtPayload } from '../types/jwt-payload';

import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersService: UsersService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: WinstonLogger,
    ) {}

    async validateUser(criteria: object, password: string) {
        const user = await this.usersService.findOne(criteria);

        if (user && (await this.comparePassword(password, user.password)))
            return user;

        return null;
    }

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    async generateJwtToken(
        payload: JwtPayload,
        type: 'accessToken' | 'refreshToken',
    ) {
        return this.jwtService.signAsync(
            payload,
            this.configService.get(`jwt.${type}`),
        );
    }

    jwtPayload(user): JwtPayload {
        return {
            sub: user.id,
            email: user.email,
            phone: user.phone,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
        };
    }

    async updateRefreshToken(refreshToken: string, userId: number) {
        await this.usersService.updateOne({ id: userId }, { refreshToken });
    }

    async signup(user: Partial<User>) {
        const userExisted = await this.usersService.checkIfEmailExist(
            user.email,
        );

        if (userExisted) throw new BadRequestException('Email already in use!');

        const createdUser = await this.usersService.create(user);

        const payload = this.jwtPayload(createdUser);

        const refreshToken = await this.generateJwtToken(
            { sub: user.id },
            'refreshToken',
        );
        const accessToken = await this.generateJwtToken(payload, 'accessToken');

        await this.updateRefreshToken(refreshToken, createdUser.id);

        return {
            accessToken,
            refreshToken,
            user: createdUser,
        };
    }

    async login(email: string, password: string) {
        const user = await this.validateUser({ email }, password);

        if (!user) throw new UnauthorizedException('Invalid credentials!');

        const payload = this.jwtPayload(user);

        const refreshToken = await this.generateJwtToken(
            { sub: user.id },
            'refreshToken',
        );
        const accessToken = await this.generateJwtToken(payload, 'accessToken');

        await this.updateRefreshToken(refreshToken, user.id);

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    async updatePassword(
        userId: number,
        currentPassword: string,
        newPassword: string,
    ) {
        if (!(await this.validateUser({ id: userId }, currentPassword)))
            throw new BadRequestException('Password is invalid!');

        const password = await this.hashPassword(newPassword);

        await this.usersService.updateOne({ id: userId }, { password });
    }

    async logout(userId: number) {
        await this.usersService.updateOne(
            { id: userId },
            { refreshToken: null },
        );
    }

    async refreshAccessToken(userId: number, refreshToken: string) {
        const user = await this.usersService.findOne({
            id: userId,
            refreshToken,
        });

        if (!user) throw new UnauthorizedException('Invalid credentials!');

        const payload = this.jwtPayload(user);

        const accessToken = await this.generateJwtToken(payload, 'accessToken');

        return {
            accessToken,
            user,
        };
    }
}
