// src/report/report.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportDto } from '../dto/reportDto/createReportDto'; // Ensure you have a ReportDto

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async createReport(createReportDto: ReportDto, userId: string) {
    const { reportCategory, reportPriority, reportableId, reportableType } = createReportDto;

    return this.prisma.report.create({
      data: {
        userId,
        reportCategory,
        reportPriority,
        reportableId: reportableId.toString(), // Convert to string if needed
        reportableType,
      },
    });
  }
}
