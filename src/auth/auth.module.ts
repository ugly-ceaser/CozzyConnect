import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JWTStrategy } from "./strategy";
import { MailService } from "../maileServices/mail.service";
import { OtpService } from "../otp/otp.service";
import { SmsService } from "src/sms/sms.service";

@Module({
    imports:[JwtModule.register({})],
    
    controllers: [AuthController],
    providers: [AuthService,JWTStrategy,MailService,OtpService,SmsService]
})
export class AuthModule{}

