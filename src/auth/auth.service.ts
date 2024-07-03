import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt';
//import mail from "../services/nodemailer/sendEmail.js";
//import NotificationStore from "../services/service.Notification.js";
import { request } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { userRegDto,userLogDto, otpDto, userEditDto, passDto } from "src/dto/userDto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConfigService } from '@nestjs/config';
import {MailService} from '../maileServices/mail.service';
import { OtpService } from "../otp/otp.service";
import { use } from "passport";
import { error } from "console";




@Injectable()
export class AuthService{

    constructor(
        private prisma:PrismaService,
        private jwt:JwtService,
        private config:ConfigService,
        private mailSender : MailService,
        private otpGen: OtpService
    ){}


    signToken =  async (
        userId:string, 
        email:string,
    ): Promise<String>=>{
        const payload ={
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET');
    
        try{
        return await this.jwt.signAsync(payload,
            {
                expiresIn : '60m',
                secret: secret
            }
        )
        }catch(error){
            throw error
        }
    
    }

    

    async login(userLogDto:userLogDto)
    {
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
        console.log(pwMatch)
        if(!pwMatch){
            throw new ForbiddenException('Credentials Incorrect:password not martched')
        }

       
        const token = await this.signToken(user.id,user.email)


        

       
        
        return{
            data:user,
            access_token :token}
    }


    async verifyEmail(Dto: otpDto){

        const findUser = await this.prisma.user.findFirst({
                  where:{
                    email :Dto.email
                  }
        })
    
        if(!findUser){
          throw new ForbiddenException('Credential Incorrect:Email  not found');
        }
    
        if(findUser.tempToken !== Dto.otp){
    
          throw new ForbiddenException('Credential Incorrect:Otp mis-match');
    
        }
        
        const user = await this.prisma.user.update({
          where:{
            email : findUser.email
    
            
          },
          data:{
            isEmailVerified : true
          }
        })
    
        if(!user){
    
          return {message:"user not found", status:false}
        }
        
        
        return { message:"success",status:true }
      }

    async register(userRegDto:userRegDto)
    {
        //generate password
        
        const hashedPwd = await argon.hash(userRegDto.password)

       

        //save new user in the db
        try{
        const user = await this.prisma.user.create({
           data:{
            fullName : " ",
            email : userRegDto.email,
            password:hashedPwd ,
            phoneNumber: " ",
            isVerified:false,
            profilePicture:"sample.jpj"
            

           },
           

        });
        

       
       

        const token = await this.signToken(user.id,user.email)

        const mailFeedback = await  this.mailSender.sendEmail(user.email,"Welcome","434434534");

        // const optFeedback = await this.otpGen.generateAndSaveOtp(userRegDto.email)

        

        return{
            data : user,
            access_token :token}

        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === "P2002"){
                    throw new ForbiddenException('Credentials taken');
                }
            }

            throw error;

        }
    }



    async updatePass(userId: string, dto: passDto) {

        console.log(userId)
        if (dto.password !== dto.confirm_password) {
            throw new ForbiddenException('Credential Incorrect: Passwords do not match');
        }
    
        const hashedPwd = await argon.hash(dto.password);
    
        try {
            const user = await this.prisma.user.update({
                where: { id: userId }, // Pass the userId here
                data: {
                    password: hashedPwd,
                },
            });
    
            if (!user) {
                throw new NotFoundException('User not found or update operation failed');
            }
    
            delete user.password;
    
            return user;
        } catch (error) {
            // Handle specific database errors if necessary
            throw new Error(`Failed to update password: ${error.message}`);
        }
    }
    
   

    
}