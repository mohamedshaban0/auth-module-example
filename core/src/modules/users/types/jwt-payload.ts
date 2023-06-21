export interface JwtPayload {
    sub: number;
    email?: string;
    phone?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
}
