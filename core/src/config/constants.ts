export default {
    accessTokenExpiresIn:
        process.env.NODE_ENV !== 'production'
            ? 2 * 60 * 60 // 2 hours in seconds
            : 10 * 60, // 10 minutes in seconds
    refreshTokenExpiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
};
