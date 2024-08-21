import { Controller, Post, Body, UseGuards, Get, Put, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { AdminAuthService,  AdminJobsService ,AdminReportsService,AdminReviewsService } from "./services";
import { AdminLoginDto, AdminRegisterDto } from './dto/adminDto';
import { AdminJWTGuard, RolesGuard } from './guard';
import { Roles, GetUser } from './decorator';
import { CreateJobDto, UpdateJobDto } from '../dto/jobDto'; // Import the DTOs for job operations

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly adminReportsService: AdminReportsService,
    private readonly adminJobsService: AdminJobsService,
    private readonly adminReviewsService: AdminReviewsService,
  ) {}

  @Post('login')
  async login(@Body() adminDto: AdminLoginDto) {
    return this.adminAuthService.login(adminDto);
  }

  @Post('register')
  async register(@Body() adminDto: AdminRegisterDto) {
    return this.adminAuthService.register(adminDto);
  }

  // Reports routes
  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_REPORTS')
  @Get('reports')
  async getAllReports(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
    return this.adminReportsService.getAllReports(page, pageSize);
  }

  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_REPORTS')
  @Get('reports/:id')
  async getReportById(@Param('id') id: number) {
    return this.adminReportsService.getReportById(id);
  }

  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_REPORTS')
  @Delete('reports/:id')
  async deleteReport(@Param('id') id: string) {
     let ID = parseInt(id)
    return this.adminReportsService.deleteReport(ID);
  }

  // Jobs routes
  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_JOBS')
  @Post('jobs')
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.adminJobsService.createJob(createJobDto);
  }

  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_JOBS')
  @Get('jobs')
  async getJobs(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
    return this.adminJobsService.getJobs(page, pageSize);
  }

  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_JOBS')
  @Get('jobs/:id')
  async getJobById(@Param('id') id: number) {
    return this.adminJobsService.getJobById(id);
  }

  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_JOBS')
  @Put('jobs/:id')
  async updateJob(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    return this.adminJobsService.updateJob(id, updateJobDto);
  }

  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_JOBS')
  @Delete('jobs/:id')
  async deleteJob(@Param('id') id: number) {
    return this.adminJobsService.deleteJob(id);
  }

  // Reviews routes
  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_REVIEWS')
  @Get('reviews')
  async getAllReviews(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
    return this.adminReviewsService.getAllReviews(page, pageSize);
  }

  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_REVIEWS')
  @Get('reviews/:id')
  async getReviewById(@Param('id') id: number) {
    return this.adminReviewsService.getReviewById(id);
  }

  @UseGuards(AdminJWTGuard, RolesGuard)
  @Roles('ADMIN_REVIEWS')
  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: number) {
    return this.adminReviewsService.deleteReview(id);
  }
}
