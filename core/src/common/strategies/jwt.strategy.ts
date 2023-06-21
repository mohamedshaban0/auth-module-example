import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req: Request) => {
                    return req.cookies['access_token'];
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.accessToken.secret'),
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub };
    }
}
