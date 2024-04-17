import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class userEditDto {

    @IsEmail()
    @IsOptional()
    email?:string  
    
    @IsString()
    @IsOptional()
    phoneNumber?:string

    @IsString()
    @IsOptional()
    fullName?:string

    @IsString()
    @IsOptional()
    password?:string

    @IsString()
    @IsOptional()
    profilePicture?:string 
}