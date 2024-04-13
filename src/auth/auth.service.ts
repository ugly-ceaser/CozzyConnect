import { ForbiddenException, Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import moment from "moment";
import { AsyncHandlerMiddleware } from '../middleware/asyn';
import {ErrorResponse} from "../utils/index";
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt';
import * as randomString from 'randomstring';
//import mail from "../services/nodemailer/sendEmail.js";
//import NotificationStore from "../services/service.Notification.js";
import { request } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { userRegDto,userLogDto } from "src/dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";




@Injectable()
export class AuthService{

    constructor(private prisma:PrismaService){}
    
    async login(userLogDto:userLogDto){
        //retrieve info

        const emailOrPhoneNumber = userLogDto.EmailOrPhoneNumber;
        

        //fetch user
        const user = await this.prisma.user.findFirst({
            where:{
                OR:[
                    {email : emailOrPhoneNumber},
                    {phoneNumber: emailOrPhoneNumber}
                ]
            }
        })
        if(!user){
            throw new ForbiddenException('Credential Incorrect:Email or Phone number not found');

        }
        //compare password

        const pwMatch = await argon.verify(user.password,userLogDto.password)
        if(!pwMatch){
            throw new ForbiddenException('Credentials Incorrect:password not martched')
        }


        //return user

        delete user.password

        return user
        
    }

    async register(userRegDto:userRegDto){
        //generate password
        
        const hashedPwd = await argon.hash(userRegDto.password)

        //save new user in the db
        try{
        const user = await this.prisma.user.create({
           data:{
            fullName :userRegDto.fullName,
            email : userRegDto.email,
            password:hashedPwd ,
            phoneNumber: userRegDto.phoneNumber,
            isVerified:false,
            profilePicture:"sample.jpj"
            

           },
           

        });
        

        delete user.password



        //return saved user
        return user
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === "P2002"){
                    throw new ForbiddenException('Credentials taken');
                }
            }

            throw error;

        }
    }
}