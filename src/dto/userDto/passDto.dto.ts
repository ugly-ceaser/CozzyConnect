import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class passDto {

   

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    confirm_password: string;
}
