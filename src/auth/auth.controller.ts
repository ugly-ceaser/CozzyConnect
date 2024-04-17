import { Body, Controller,HttpCode,HttpStatus,Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { userRegDto,userLogDto } from "../dto";

@Controller('auth')
export class AuthController{
    constructor(private authservice : AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() userLogDto:userLogDto){

        return this.authservice.login(userLogDto)
    }

    
    @Post('register')
    register(@Body() userRegDto:userRegDto){
        return this.authservice.register(userRegDto)
    }

}