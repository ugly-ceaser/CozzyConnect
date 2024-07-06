import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CreateUserKycDto,  UpdateUserKycDto } from '../dto/kycDto/index';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { JWTGaurd } from '../auth/gaurd';

@UseGuards(JWTGaurd)
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() createUserKycDto: CreateUserKycDto) {

    createUserKycDto.userId = userId
    return this.verificationService.create(createUserKycDto);
  }

  @Get()
  findOne(@GetUser('id') userId: string) {
    return this.verificationService.findOne(userId);
  }

  @Patch()
  update(@GetUser('id') userId: string, @Body() updateUserKycDto: UpdateUserKycDto) {
    return this.verificationService.update(userId, updateUserKycDto);
  }

  @Delete()
  remove(@GetUser('id') userId: string) {
    return this.verificationService.remove(userId);
  }
}
