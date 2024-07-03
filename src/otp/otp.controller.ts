import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

import {otpDto} from '../dto/userDto'


@Controller('otp')
export class OtpController {
    constructor(private otpService : OtpService){}

    @Post('request')
    request(@Body() dto : otpDto){
        
        return this.otpService.requestOtp(dto)

    }


    @Post('verify')
    verifyOtp( @Body() dto :otpDto ){

        return this.otpService.verifyOtp(dto)
    }

  

    
}
