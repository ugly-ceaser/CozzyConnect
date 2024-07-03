import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class userRegDto {

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email:string  
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phoneNumber:string


    @IsString()
    @IsNotEmpty()
    password:string

  
}