import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class userEditDto {

    @IsEmail()
    @IsOptional()
    email?: string; // Use TypeScript's optional chaining

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    profilePicture?: string;
}
