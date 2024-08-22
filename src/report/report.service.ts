import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, UpdateReportDto } from '../dto/reportDto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto) {
    const { userId, ...rest } = createReportDto;
    try {
      const report = await this.prisma.report.create({
        data: {
          ...rest,
          user: { connect: { id: userId } },
        },
      });
      return { data: report, success: true };
    } catch (error) {
      console.error('Error creating report:', error);
      throw new InternalServerErrorException('Failed to create report');
    }
  }

  async findAll() {
    try {
      const reports = await this.prisma.report.findMany();
      return { data: reports, success: true };
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new InternalServerErrorException('Failed to fetch reports');
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
      return { data: report, success: true };
    } catch (error) {
      console.error('Error fetching report:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch report');
    }
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    try {
      const report = await this.findOne(id); // Ensure report exists
      const updatedReport = await this.prisma.report.update({
        where: { id },
        data: updateReportDto,
      });
      return { data: updatedReport, success: true };
    } catch (error) {
      console.error('Error updating report:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update report');
    }
  }

  async remove(id: number) {
    try {
      const report = await this.findOne(id); // Ensure report exists
      await this.prisma.report.delete({
        where: { id },
      });
      return { data: null, success: true };
    } catch (error) {
      console.error('Error deleting report:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete report');
    }
  }
}
