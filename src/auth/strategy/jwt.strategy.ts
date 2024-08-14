import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JWTStrategy extends PassportStrategy(
    Strategy,
    'jwt',
){
    constructor(
        config : ConfigService,
        private prisma : PrismaService


    ){
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey:config.get('JWT_SECRET')

        });
    }

    async validate(payload: { sub: string; email: string }) {
        console.log('JWT Payload:', payload);
    
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
    
        console.log('User found:', user);
    
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
    
        const { password, ...result } = user;
    
        return result;
    }
    


 
}