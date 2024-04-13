import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class userRegDto {

    @IsEmail()
    @IsNotEmpty()
    email:string  
    
    @IsString()
    @IsNotEmpty()
    phoneNumber:string

    @IsString()
    @IsNotEmpty()
    fullName:string

    @IsString()
    @IsNotEmpty()
    password:string

    @IsString()
    profilePicture:string 
}