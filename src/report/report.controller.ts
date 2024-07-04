// src/report/report.controller.ts

import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { JWTGaurd } from '../auth/gaurd';
import { CreateReportDto, UpdateReportDto } from '../dto/reportDto/';

@UseGuards(JWTGaurd)
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  createReport(@GetUser('id') userId: string, @Body() reportDto: CreateReportDto): any {
    reportDto.userId = userId
    return this.reportService.create(reportDto); 
  }
}
