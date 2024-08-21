import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto } from '../../dto/jobDto/index'; // Import DTOs for validation and typing

@Injectable()
export class  AdminJobsService {
    constructor(private readonly prisma: PrismaService) {}

    async createJob(createJobDto: CreateJobDto) {
        const { companyName, jobTitle, jobDescription, keyResponsibilities, qualifications, workArrangement, applicationUrl } = createJobDto;

        const job = await this.prisma.jobMarket.create({
            data: {
                companyName,
                jobTitle,
                jobDescription,
                keyResponsibilities,
                qualifications,
                workArrangement,
                applicationUrl,
                
            },
        });

        return job;
    }

    async getJobs(page: number = 1, pageSize: number = 10) {
        const take = pageSize;
        const skip = (page - 1) * pageSize;

        const jobs = await this.prisma.jobMarket.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const totalJobs = await this.prisma.jobMarket.count();

        return {
            jobs,
            total: totalJobs,
            page,
            pageSize,
            totalPages: Math.ceil(totalJobs / pageSize),
        };
    }

    async getJobById(id: number) {
        const job = await this.prisma.jobMarket.findUnique({
            where: { id },
        });

        if (!job) {
            throw new NotFoundException(`Job with ID ${id} not found`);
        }

        return job;
    }

    async updateJob(id: number, updateJobDto: UpdateJobDto) {
        const { companyName, jobTitle, jobDescription, keyResponsibilities, qualifications, workArrangement, applicationUrl } = updateJobDto;

        const job = await this.prisma.jobMarket.update({
            where: { id },
            data: {
                companyName,
                jobTitle,
                jobDescription,
                keyResponsibilities,
                qualifications,
                workArrangement,
                applicationUrl,
            },
        });

        return job;
    }

    async deleteJob(id: number) {
        const job = await this.prisma.jobMarket.delete({
            where: { id },
        });

        return job;
    }
}
