import { Injectable } from '@nestjs/common';
import { userEditDto } from 'src/dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}
    async editUser(userId:string,dto:userEditDto)
    {
        const user = await this.prisma.user.update({
            where:{
                id:userId
            },
            data:{
                ...dto
            },
        });

        delete user.password;

        return user;

    }
}
