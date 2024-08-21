import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../prisma/prisma.service";
import { userRegDto, userLogDto, otpDto, passDto,EditAuthtDto  } from "../dto/userDto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConfigService } from '@nestjs/config';
import { MailService } from '../maileServices/mail.service';
import { OtpService } from "../otp/otp.service";


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private mailSender: MailService,
        private otpGen: OtpService
    ) {}

    signToken = async (userId: string, email: string): Promise<string> => {
        const payload = { sub: userId, email };
        const secret = this.config.get('JWT_SECRET');
    
        try {
            return await this.jwt.signAsync(payload, {
                expiresIn: '7d', // Set the token expiration to 7 days
                secret: secret
            });
        } catch (error) {
            console.error('Error signing token:', error);
            throw error;
        }
    };
    

    async login(userLogDto: userLogDto) {
        const emailOrPhoneNumber = userLogDto.EmailOrPhoneNumber;

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrPhoneNumber },
                    { phoneNumber: emailOrPhoneNumber }
                ]
            }
        });

        if (!user) {
            throw new ForbiddenException('Credential Incorrect: Email or Phone number not found');
        }

        const pwMatch = await argon.verify(user.password, userLogDto.password);

        if (!pwMatch) {
            throw new ForbiddenException('Credentials Incorrect: Password not matched');
        }

        const token = await this.signToken(user.id, user.email);

        return {
            data: user,
            access_token: token
        };
    }

    async verifyEmail(Dto: otpDto) {
        const findUser = await this.prisma.user.findFirst({
            where: { email: Dto.email }
        });

        if (!findUser) {
            throw new ForbiddenException('Credential Incorrect: Email not found');
        }

        if (findUser.tempToken !== Dto.otp) {
            throw new ForbiddenException('Credential Incorrect: OTP mismatch');
        }

        const user = await this.prisma.user.update({
            where: { email: findUser.email },
            data: { isEmailVerified: true }
        });

        if (!user) {
            throw new NotFoundException('User not found or update operation failed');
        }

        return { message: "success", status: true };
    }

    async verifyPhone(Dto: otpDto) {
        const findUser = await this.prisma.user.findFirst({
            where: { email: Dto.email }
        });

        if (!findUser) {
            throw new ForbiddenException('Credential Incorrect: Email not found');
        }

        if (findUser.tempToken !== Dto.otp) {
            throw new ForbiddenException('Credential Incorrect: OTP mismatch');
        }

        const user = await this.prisma.user.update({
            where: { email: findUser.email },
            data: {
                isEmailVerified: true,
                phoneNumber: Dto.phoneNumber,
                isNumberVerified: true,
            }
        });

        if (!user) {
            throw new NotFoundException('User not found or update operation failed');
        }

        return { message: "success", status: true };
    }

    async register(userRegDto: userRegDto) {
        try {
            // Debugging logs
            console.log('Received user registration data:', userRegDto);
    
            // Ensure password is not undefined
            if (!userRegDto.password) {
                throw new Error('Password is missing');
            }
    
            // Hash the password
            const hashedPwd = await argon.hash(userRegDto.password);
            console.log('Hashed Password:', hashedPwd);
    
            // Create user in the database
            const user = await this.prisma.user.create({
                data: {
                    email: userRegDto.email,
                    password: hashedPwd,
                    isVerified: false,
                },
            });
    
            // Generate a token
            const token = await this.signToken(user.id, user.email);
    
            // Send welcome email
            await this.mailSender.sendEmail(user.email, "Welcome", "434434534");
    
            // Return the user data and token
            return {
                data: user,
                access_token: token,
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException('Credentials taken');
                }
            }
    
            console.error('Error registering user:', error);
            throw error;
        }
    }
    

    async updatePass(userId: string, dto: passDto) {
        if (dto.password !== dto.confirm_password) {
            throw new ForbiddenException('Credential Incorrect: Passwords do not match');
        }

        const hashedPwd = await argon.hash(dto.password);

        try {
            const user = await this.prisma.user.update({
                where: { id: userId },
                data: { password: hashedPwd },
            });

            if (!user) {
                throw new NotFoundException('User not found or update operation failed');
            }

            delete user.password;

            return user;
        } catch (error) {
            console.error('Error updating password:', error);
            throw new Error(`Failed to update password: ${error.message}`);
        }
    }

   
}
