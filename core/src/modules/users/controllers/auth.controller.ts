import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    Res,
    UseGuards,
    Delete,
    HttpStatus,
    Inject,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { User, Cookie, Public } from '@common/decorators';

import { AuthService } from '../services/auth.service';

import { SignupDto, LoginDto, UpdatePasswordDto } from '../dto';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: WinstonLogger,
    ) {}

    sendAccessTokenCookie(res, accessToken) {
        res.cookie(
            'access_token',
            accessToken,
            this.configService.get('cookie.accessTokenCookieOptions'),
        );
    }

    sendRefreshTokenCookie(res, refreshToken) {
        res.cookie(
            'refresh_token',
            refreshToken,
            this.configService.get('cookie.refreshTokenCookieOptions'),
        );
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Res({ passthrough: true }) res: Response,
        @Body() credentials: LoginDto,
    ) {
        const { accessToken, refreshToken, user } =
            await this.authService.login(
                credentials.email,
                credentials.password,
            );

        this.sendAccessTokenCookie(res, accessToken);
        this.sendRefreshTokenCookie(res, refreshToken);

        this.logger.log({
            message: 'user logged in',
            userId: user.id,
        });

        return { user };
    }

    @Public()
    @Post('signup')
    async signup(
        @Res({ passthrough: true }) res: Response,
        @Body() signupBody: SignupDto,
    ) {
        const { user, accessToken, refreshToken } =
            await this.authService.signup(signupBody);

        this.sendAccessTokenCookie(res, accessToken);
        this.sendRefreshTokenCookie(res, refreshToken);

        this.logger.log({
            message: 'new user signed up',
            userId: user.id,
        });

        return { user };
    }

    @Delete('logout')
    async logout(@User() user, @Res({ passthrough: true }) res: Response) {
        await this.authService.logout(user.userId);

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
    }

    @UseGuards(AuthGuard('refresh_jwt'))
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshAccessToken(
        @Cookie('refresh_token') refreshToken,
        @User() user,
        @Res({ passthrough: true }) res,
    ) {
        const { accessToken } = await this.authService.refreshAccessToken(
            user.userId,
            refreshToken,
        );

        this.sendAccessTokenCookie(res, accessToken);
        return {};
    }

    @Post('update-password')
    @HttpCode(HttpStatus.OK)
    async updatePassword(@User() user, @Body() body: UpdatePasswordDto) {
        await this.authService.updatePassword(
            user.userId,
            body.currentPassword,
            body.newPassword,
        );

        this.logger.log({
            message: 'user password updated',
            userId: user.userId,
        });

        return { status: 'success' };
    }
}
