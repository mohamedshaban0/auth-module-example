import { registerAs } from '@nestjs/config';

import constants from './constants';

export default registerAs('cookie', () => {
    const options = {
        secure: process.env.NODE_ENV !== 'production' ? false : true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV !== 'production' ? 'none' : 'strict',
    };

    return {
        accessTokenCookieOptions: {
            ...options,
            maxAge: constants.accessTokenExpiresIn * 1000, // convert seconds to milliseconds
        },
        refreshTokenCookieOptions: {
            ...options,
            maxAge: constants.refreshTokenExpiresIn * 1000, // convert seconds to milliseconds
        },
    };
});
