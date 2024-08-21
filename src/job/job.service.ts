// src/job-market/job-market.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto,UpdateJobDto } from '../dto/jobDto';


@Injectable()
export class JobMarketService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createJobDto: CreateJobDto) {
    return this.prisma.jobMarket.create({
      data: {
        ...createJobDto,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.jobMarket.findMany();
  }

  async findOne(id: number) {
    return this.prisma.jobMarket.findUnique({ where: { id } });
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    return this.prisma.jobMarket.update({
      where: { id },
      data: updateJobDto,
    });
  }

  async remove(id: number) {
    return this.prisma.jobMarket.delete({ where: { id } });
  }
}
