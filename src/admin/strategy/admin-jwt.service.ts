import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AdminJWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: string; email: string }) {
        console.log('Admin JWT Payload:', payload);

        const admin = await this.prisma.admin.findUnique({
            where: {
                id: payload.sub,
            },
            include: {
                roles: true, // Include roles correctly
            },
        });

        console.log('Admin found:', admin);

        if (!admin) {
            throw new UnauthorizedException('Admin not found');
        }

        const { password, ...result } = admin;

        return result;
    }
}
