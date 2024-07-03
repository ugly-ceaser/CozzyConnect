import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../maileServices/mail.service';
import { otpDto } from '../dto/userDto';
import { stat } from 'fs';


@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private mailSender: MailService,
  ) {}

  // Generate a random 4-digit code
  private generateRandomCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }






  async generateAndSaveOtp(email: string): Promise<void> {
    let otpCode;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ForbiddenException(
        'Credential Incorrect:Email not found ')
    }

    otpCode = this.generateRandomCode();

    await this.prisma.user.update({
      where: { email },
      data: { tempToken: otpCode },
    });

    const feedback = await this.mailSender.sendEmail(
      email,
      'might delete later',
      otpCode,
    );

    

  

   

    // Schedule the deletion of tempToken after 40 seconds
    setTimeout(async () => {
      await this.prisma.user.update({
        where: { email },
        data: { tempToken: null },
      });
    }, 300000);
  
  }

  async requestOtp(Dto: otpDto) {
   

    if (!Dto.email && !Dto.phoneNumber) {

      throw new ForbiddenException('Credential Incorrect:Email or number not  found');

    } else if (Dto.email) {

      await this.generateAndSaveOtp(Dto.email);

      return {
        message :"success",
        status: true
      }
      

    
    } else if (Dto.phoneNumber) {
      throw new ForbiddenException(
        'Credential info:Phone Verification isnt available',
      );
    }else{

      throw new ForbiddenException(
        'Credential info:Otp Operation failed',
      );

    }

  }

  async verifyOtp(Dto: otpDto) {


    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: Dto.email }, { phoneNumber: Dto.phoneNumber }],
      },
    });

    if (!user) {
      if (!Dto.email) {
        throw new ForbiddenException(
          'Credential Incorrect:Phone number not found',
        );
      }

      throw new ForbiddenException('Credential Incorrect:Email not found');
    }

    const pwMatch = user.tempToken == Dto.otp;


    if (!pwMatch) {
      throw new ForbiddenException('Credentials Incorrect:Otp not martched');
    }



    

    return {
      message: "Success",
      status:true
    }

    
    
  }

 
}
