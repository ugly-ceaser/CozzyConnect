import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto } from '../dto/jobDto';

@Injectable()
export class JobMarketService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createJobDto: CreateJobDto): Promise<{ data: any; success: boolean }> {
    try {
      const job = await this.prisma.jobMarket.create({
        data: {
          ...createJobDto,
          userId,
        },
      });
      return { data: job, success: true };
    } catch (error) {
      console.error('Error creating job:', error);
      throw new InternalServerErrorException('Failed to create job');
    }
  }

  async findAll(): Promise<{ data: any[]; success: boolean }> {
    try {
      const jobs = await this.prisma.jobMarket.findMany();
      return { data: jobs, success: true };
    } catch (error) {
      console.error('Error finding jobs:', error);
      throw new InternalServerErrorException('Failed to retrieve jobs');
    }
  }

  async findOne(id: number): Promise<{ data: any; success: boolean }> {
    try {
      const job = await this.prisma.jobMarket.findUnique({ where: { id } });
      if (!job) {
        throw new NotFoundException('Job not found');
      }
      return { data: job, success: true };
    } catch (error) {
      console.error('Error finding job:', error);
      throw new InternalServerErrorException('Failed to retrieve job');
    }
  }

  async update(id: number, updateJobDto: UpdateJobDto): Promise<{ data: any; success: boolean }> {
    try {
      const job = await this.prisma.jobMarket.update({
        where: { id },
        data: updateJobDto,
      });
      return { data: job, success: true };
    } catch (error) {
      console.error('Error updating job:', error);
      throw new InternalServerErrorException('Failed to update job');
    }
  }

  async remove(id: number): Promise<{ data: any; success: boolean }> {
    try {
      const job = await this.prisma.jobMarket.delete({ where: { id } });
      return { data: job, success: true };
    } catch (error) {
      console.error('Error deleting job:', error);
      throw new InternalServerErrorException('Failed to delete job');
    }
  }
}
