import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, UpdateReportDto } from '../dto/reportDto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto) {
    const { userId, ...rest } = createReportDto;
    try {
      return await this.prisma.report.create({
        data: {
          ...rest,
          user: { connect: { id: userId } },
        },
      });
    } catch (error) {
      throw new Error(`Failed to create report: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.report.findMany();
    } catch (error) {
      throw new Error(`Failed to fetch reports: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const report = await this.prisma.report.findUnique({
        where: { id },
      });
      if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }
      return report;
    } catch (error) {
      throw new Error(`Failed to fetch report: ${error.message}`);
    }
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    try {
      const report = await this.findOne(id); // Ensure report exists
      return await this.prisma.report.update({
        where: { id },
        data: updateReportDto,
      });
    } catch (error) {
      throw new Error(`Failed to update report: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const report = await this.findOne(id); // Ensure report exists
      return await this.prisma.report.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete report: ${error.message}`);
    }
  }
}
