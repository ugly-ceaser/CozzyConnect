import { 
    Controller,
    Get,
    Post,
    Req,
    UseGuards, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JWTGaurd } from '../auth/gaurd';


@UseGuards(JWTGaurd)
@Controller('users')
export class UserController {
   
   
    @Get('/profile')
    home(@GetUser() user:User){
            return user
    }

    

    @Post('/update')
    updateProfile(){
        return "profile"
    }

   

    
}
