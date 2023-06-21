import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class RefreshJwtAuthStrategy extends PassportStrategy(
    Strategy,
    'refresh_jwt',
) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req.cookies['refresh_token'];
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.refreshToken.secret'),
        });
    }

    async validate(payload: JwtPayload) {
        return { userId: payload.sub };
    }
}
