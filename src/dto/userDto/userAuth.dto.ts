import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class userRegDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class userLogDto {
  @IsString()
  EmailOrPhoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class passDto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirm_password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class EditAuthtDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  phoneNumber?: string;
}
