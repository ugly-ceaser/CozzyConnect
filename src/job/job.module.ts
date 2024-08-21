// src/job-market/job-market.module.ts
import { Module } from '@nestjs/common';
import { JobMarketService } from './job.service';
import { JobMarketController } from './job.contoller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [JobMarketController],
  providers: [JobMarketService, PrismaService],
})
export class JobMarketModule {}


