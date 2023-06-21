import { Transform } from 'class-transformer';
import {
    IsString,
    IsEmail,
    Length,
    IsNotEmpty,
    IsOptional,
} from 'class-validator';

export class SignupDto {
    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @Transform(({ value }) => value.trim())
    email: string;

    @IsOptional()
    phone: string;

    @Length(8, 20)
    password: string;
}

export class LoginDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class UpdatePasswordDto {
    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @Length(8, 20)
    newPassword: string;
}
