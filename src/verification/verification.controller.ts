import { Controller,Post } from '@nestjs/common';

@Controller('verify')
export class VerificationController {
    @Post('/')
    verify(){
        return "verify"
    }
}
