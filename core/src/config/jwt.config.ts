import { registerAs } from '@nestjs/config';

import constants from './constants';

export default registerAs('jwt', () => ({
    accessToken: {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: constants.accessTokenExpiresIn,
    },
    refreshToken: {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: constants.refreshTokenExpiresIn,
    },
}));
