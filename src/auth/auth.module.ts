import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JWTStrategy } from "./strategy";
import { MailService } from "../maileServices/mail.service";
import { OtpService } from "../otp/otp.service";

@Module({
    imports:[JwtModule.register({})],
    
    controllers: [AuthController],
    providers: [AuthService,JWTStrategy,MailService,OtpService]
})
export class AuthModule{}

