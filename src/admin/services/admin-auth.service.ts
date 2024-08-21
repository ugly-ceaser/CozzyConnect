// admin-auth.service.ts
import { ForbiddenException, Injectable } from "@nestjs/common";
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../../prisma/prisma.service";
import { AdminLoginDto, AdminRegisterDto } from "../dto/adminDto";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    private signToken = async (adminId: string, email: string): Promise<string> => {
        const payload = { sub: adminId, email };
        const secret = this.config.get('ADMIN_JWT_SECRET');

        return await this.jwt.signAsync(payload, {
            expiresIn: '7d',
            secret: secret,
        });
    };

    async login(adminLoginDto: AdminLoginDto) {
        const { email, password } = adminLoginDto;

        const admin = await this.prisma.admin.findUnique({
            where: { email },
            include: { roles: true },
        });

        if (!admin) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const pwMatch = await argon.verify(admin.password, password);

        if (!pwMatch) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const token = await this.signToken(admin.id, admin.email);

        return {
            data: admin,
            access_token: token,
        };
    }

    async register(adminRegisterDto: AdminRegisterDto) {
        const { email, password, roles } = adminRegisterDto;
        const hashedPwd = await argon.hash(password);

        try {
            const roleRecords = await this.prisma.role.findMany({
                where: { name: { in: roles } },
            });

            const admin = await this.prisma.admin.create({
                data: {
                    email,
                    password: hashedPwd,
                    roles: {
                        connect: roleRecords.map(role => ({ id: role.id })),
                    },
                },
                include: { roles: true },
            });

            const token = await this.signToken(admin.id, admin.email);

            return {
                data: admin,
                access_token: token,
            };
        } catch (error) {
            throw new ForbiddenException('Credentials taken');
        }
    }

    async protectedAction(user: any) {
        return true;
    }
}
