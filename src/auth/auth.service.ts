import { ForbiddenException, Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../prisma/prisma.service";
import { userRegDto, userLogDto, otpDto, passDto, EditAuthtDto } from "../dto/userDto";
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
                expiresIn: '7d',
                secret: secret,
            });
        } catch (error) {
            console.error('Error signing token:', error);
            throw new InternalServerErrorException('Failed to sign token');
        }
    };

    async login(userLogDto: userLogDto): Promise<{ data: any; success: boolean; access_token?: string }> {
        try {
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
                success: true,
                access_token: token,
            };
        } catch (error) {
            console.error('Error during login:', error);
            throw new InternalServerErrorException('Login failed');
        }
    }

    async verifyEmail(Dto: otpDto): Promise<{ data: any; success: boolean }> {
        try {
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

            return { data: user, success: true };
        } catch (error) {
            console.error('Error verifying email:', error);
            throw new InternalServerErrorException('Email verification failed');
        }
    }

    async verifyPhone(Dto: otpDto): Promise<{ data: any; success: boolean }> {
        try {
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

            return { data: user, success: true };
        } catch (error) {
            console.error('Error verifying phone:', error);
            throw new InternalServerErrorException('Phone verification failed');
        }
    }

    async register(userRegDto: userRegDto): Promise<{ data: any; success: boolean; access_token?: string }> {
        try {
            const hashedPwd = await argon.hash(userRegDto.password);

            const user = await this.prisma.user.create({
                data: {
                    email: userRegDto.email,
                    password: hashedPwd,
                    isVerified: false,
                },
            });

            const token = await this.signToken(user.id, user.email);

            await this.mailSender.sendEmail(user.email, "Welcome", "434434534");

            return {
                data: user,
                success: true,
                access_token: token,
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            console.error('Error registering user:', error);
            throw new InternalServerErrorException('Registration failed');
        }
    }

    async updatePass(userId: string, dto: passDto): Promise<{ data: any; success: boolean }> {
        if (dto.password !== dto.confirm_password) {
            throw new ForbiddenException('Credential Incorrect: Passwords do not match');
        }

        try {
            const hashedPwd = await argon.hash(dto.password);

            const user = await this.prisma.user.update({
                where: { id: userId },
                data: { password: hashedPwd },
            });

            return {
                data: user,
                success: true,
            };
        } catch (error) {
            console.error('Error updating password:', error);
            throw new InternalServerErrorException('Failed to update password');
        }
    }
}
