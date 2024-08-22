import { Controller, Post, Get, Patch, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CreateUserKycDto, UpdateUserKycDto } from '../dto/kycDto';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { JWTGaurd } from '../auth/gaurd';

@UseGuards(JWTGaurd)
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  async create(@GetUser('id') userId: string, @Body() createUserKycDto: CreateUserKycDto) {
    createUserKycDto.userId = userId;
    return this.verificationService.create(createUserKycDto);
  }

  @Get()
  async findOne(@GetUser('id') userId: string) {
    console.log(`GET /verification called with UserID: ${userId}`);
    return this.verificationService.findOne(userId);
  }

  @Patch()
  async update(@GetUser('id') userId: string, @Body() updateUserKycDto: UpdateUserKycDto) {
    return this.verificationService.update(userId, updateUserKycDto);
  }

  @Delete()
  async remove(@GetUser('id') userId: string) {
    return this.verificationService.remove(userId);
  }

  @Get('test')
  testRoute() {
    return 'Verification route works!';
  }
}
