import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class otpDto {

    @IsEmail()
    @IsOptional()
    email?: string; // Use TypeScript's optional chaining

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    otp?: string;

    
    @IsString()
    @IsNotEmpty()
    dataVerified: string;

   
}
