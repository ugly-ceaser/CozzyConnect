// src/report/report.controller.ts

import { Controller, Post, Body, Param } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post(':userId')
  createReport(@Param('userId') userId: string, @Body() reportDto: any): any {
    return this.reportService.createReport(reportDto, userId); // Check ReportService for createReport method
  }
}
