import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Make sure this path is correct
import { Report } from '@prisma/client'; // Adjust this import based on your setup

@Injectable()
export class AdminReportsService {
  constructor(private prisma: PrismaService) {}

  // Fetch all reports with pagination
  async getAllReports(page: number = 1, pageSize: number = 10): Promise<Report[]> {
    const skip = (page - 1) * pageSize;
    return this.prisma.report.findMany({
      skip,
      take: pageSize,
    });
  }

  // Fetch a single report by ID
  async getReportById(id: number): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  // Delete a report by ID
  async deleteReport(id: number): Promise<void> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    await this.prisma.report.delete({
      where: { id },
    });
  }
}
