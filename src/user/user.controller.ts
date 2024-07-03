import { 
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UseGuards, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JWTGaurd } from '../auth/gaurd';
import { userEditDto } from '../dto/userDto/editUser.dto';
import { UserService } from './user.service';


@UseGuards(JWTGaurd)
@Controller('users')
export class UserController {
    constructor(private userService:UserService){}
   
   
    @Get('/profile')
    home(@GetUser() user:User){
            return user
    }

    

    @Patch('/update/:id')
    updateProfile(
        @GetUser('id')  userId:string,
        @Body() dto :userEditDto
    ){

        return this.userService.editUser(userId,dto)
    }
    

   

    
}
