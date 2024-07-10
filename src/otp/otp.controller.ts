import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { otpDto } from '../dto/userDto';

@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post('request')
  async request(@Body() dto: otpDto) {
    if (!dto.email && !dto.phoneNumber) {
      throw new BadRequestException('Either email or phone number must be provided');
    }
    return this.otpService.requestOtp(dto);
  }

 
}
