import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../maileServices/mail.service';
import { SmsService } from '../sms/sms.service';
import { otpDto } from '../dto/userDto';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private mailSender: MailService,
    private smsSender: SmsService,
  ) {}

  // Generate a random 4-digit code
  private generateRandomCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Generate and send OTP to email
  async generateAndSaveOtp(otpDto: otpDto): Promise<void> {
    const { email } = otpDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ForbiddenException('Credential Incorrect: Email not found');
    }

    const otpCode = this.generateRandomCode();
    await Promise.all([
      this.prisma.user.update({
        where: { email },
        data: { tempToken: otpCode },
      }),
      this.mailSender.sendEmail(email, 'OTP Verification', otpCode)
    ]);

    // Schedule the deletion of tempToken after 15 minutes
    setTimeout(() => {
      this.prisma.user.update({
        where: { email },
        data: { tempToken: null },
      }).catch(error => console.error('Error clearing tempToken:', error));
    }, 900000); // 15 minutes in milliseconds
  }

  // Generate and send OTP to phone number
  async generateAndSaveOtpForPhone(otpDto: otpDto): Promise<void> {
    const { email, phoneNumber } = otpDto;
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ForbiddenException('Credential Incorrect: Email not found');
    }

    const otpCode = this.generateRandomCode();
    const updateUserPromise = user.phoneNumber ? 
      Promise.resolve() : 
      this.prisma.user.update({
        where: { email },
        data: { phoneNumber: formattedPhoneNumber },
      });

    await Promise.all([
      updateUserPromise,
      this.prisma.user.update({
        where: { id: user.id },
        data: { tempToken: otpCode },
      }),
      this.smsSender.sendSms(formattedPhoneNumber, `Your OTP code is ${otpCode}`)
    ]);

    // Schedule the deletion of tempToken after 15 minutes
    setTimeout(() => {
      this.prisma.user.update({
        where: { id: user.id },
        data: { tempToken: null },
      }).catch(error => console.error('Error clearing tempToken:', error));
    }, 900000); // 15 minutes in milliseconds
  }

  // Format phone number to E.164
  private formatPhoneNumber(phoneNumber: string): string {
    if (phoneNumber.startsWith('0')) {
      return '234' + phoneNumber.slice(1);
    }
    return phoneNumber;
  }

  async requestOtp(Dto: otpDto) {
    const { email, phoneNumber, dataVerified } = Dto;

    if (!email && !phoneNumber) {
      throw new ForbiddenException('Credential Incorrect: Email or phone number not found');
    } else if (dataVerified === 'email' && email) {
      await this.generateAndSaveOtp(Dto);
    } else if (dataVerified === 'phoneNumber' && phoneNumber) {
      await this.generateAndSaveOtpForPhone(Dto);
    } else {
      throw new ForbiddenException('Credential Incorrect: OTP operation failed');
    }

    return { message: 'Success', status: true };
  }
}
