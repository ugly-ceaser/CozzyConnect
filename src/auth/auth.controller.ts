import { Body, Controller,HttpCode,HttpStatus,Post,Get, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { userRegDto,userLogDto, otpDto, userEditDto,passDto } from "../dto/userDto";
import { GetUser } from "./decorator";

@Controller('auth')
export class AuthController{
    constructor(private authservice : AuthService){
    }
    

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() userLogDto:userLogDto)
    {

        return this.authservice.login(userLogDto)
    }


    @Post('verify/email')
    verifyEmial(@Body() Dto:otpDto){

        return this.authservice.verifyEmail(Dto)

    }



    @Post('verify/phone')
    verifyPhoneNumber(@Body() Dto:otpDto){

        return this.authservice.verifyPhone(Dto)

    }

 

    
    @Post('register')
    register(@Body() userRegDto:userRegDto)
    {
        return this.authservice.register(userRegDto)
    }

    

    @Post('fpwd/:id')
    forgotPassword(
        @Body() dto: passDto,
        @Param('id') userId: string 
    ) {
        return this.authservice.updatePass(userId, dto);
    }
    

   

}