import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JobMarketService } from './job.service';
import { CreateJobDto,UpdateJobDto } from '../dto/jobDto';
import { JWTGaurd } from '../auth/gaurd';
import { AdminJWTGuard } from 'src/admin/guard';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { Request } from 'express';

@Controller('job-market')
export class JobMarketController {
  constructor(private readonly jobMarketService: JobMarketService) {}

  @UseGuards(AdminJWTGuard)
  @Post()
  async create(
     @Body() createJobDto: CreateJobDto,
     @GetUser('id') userId: string
) {
   
    return this.jobMarketService.create(userId, createJobDto);
  }

  @Get()
  async findAll() {
    return this.jobMarketService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.jobMarketService.findOne(id);
  }

  @UseGuards(JWTGaurd)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    return this.jobMarketService.update(id, updateJobDto);
  }

  @UseGuards(AdminJWTGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.jobMarketService.remove(id);
  }
}
