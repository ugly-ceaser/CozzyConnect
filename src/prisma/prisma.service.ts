import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { url } from 'inspector';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(){
        super({
            datasources:{
                db:{
                    url:"postgresql://postgres:123@localhost:5434/cozzyconnect?schema=public"
                }
            }

        })
    }
}
