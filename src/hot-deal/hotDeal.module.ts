import { Module } from '@nestjs/common';
import {HotDealController} from './hotDeal.controller';
import { HotDealService} from './hotDeal.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [HotDealService],
  controllers:[ HotDealController],
  exports: [HotDealService], 
})
export class HotDealModule {}
