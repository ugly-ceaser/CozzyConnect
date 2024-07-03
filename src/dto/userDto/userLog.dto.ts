import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class userLogDto {

      
    
    @IsString()
    @IsNotEmpty()
    EmailOrPhoneNumber:string

    @IsString()
    @IsNotEmpty()
    password:string

    
}