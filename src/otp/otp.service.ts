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
    const email = otpDto.email;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ForbiddenException('Credential Incorrect: Email not found');
    }

    const otpCode = this.generateRandomCode();

    await this.prisma.user.update({
      where: { email },
      data: { tempToken: otpCode },
    });

    await this.mailSender.sendEmail(email, 'OTP Verification', otpCode);

    // Schedule the deletion of tempToken after 15 minutes
    setTimeout(async () => {
      await this.prisma.user.update({
        where: { email },
        data: { tempToken: null },
      });
    }, 900000); // 15 minutes in milliseconds
  }

  // Generate and send OTP to phone number
  async generateAndSaveOtpForPhone(otpDto: otpDto): Promise<void> {
    const email = otpDto.email;
    const phoneNumber = this.formatPhoneNumber(otpDto.phoneNumber);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ForbiddenException('Credential Incorrect: Email not found');
    }

    // Update user with provided phone number if it doesn't exist
    if (!user.phoneNumber) {
      await this.prisma.user.update({
        where: { email },
        data: { phoneNumber },
      });
    }

    const otpCode = this.generateRandomCode();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { tempToken: otpCode },
    });

    console.log('Formatted phone number:', phoneNumber);

    try {
      await this.smsSender.sendSms(phoneNumber, `Your OTP code is ${otpCode}`);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new ForbiddenException('Failed to send OTP SMS');
    }

    // Schedule the deletion of tempToken after 15 minutes
    setTimeout(async () => {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { tempToken: null },
      });
    }, 900000); // 15 minutes in milliseconds
  }

  // Format phone number to E.164
  private formatPhoneNumber(phoneNumber: string): string {
    // Assuming the phone number is a Nigerian number without the country code
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '234' + phoneNumber.slice(1);
    }
    return phoneNumber;
  }

  async requestOtp(Dto: otpDto) {
    const email = Dto.email;
    const phoneNumber = Dto.phoneNumber;
    const dataVerified = Dto.dataVerified;

    if (!email && !phoneNumber) {
      throw new ForbiddenException('Credential Incorrect: Email or phone number not found');
    } else if (dataVerified === 'email' && email) {
      await this.generateAndSaveOtp(Dto);
      return { message: 'Success', status: true };
    } else if (dataVerified === 'phoneNumber' && phoneNumber) {
      await this.generateAndSaveOtpForPhone(Dto);
      return { message: 'Success', status: true };
    } else {
      throw new ForbiddenException('Credential Incorrect: OTP operation failed');
    }
  }
}
