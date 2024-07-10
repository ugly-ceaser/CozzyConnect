import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private readonly client: Twilio;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(receiver: string, message: string): Promise<void> {
    try {
      const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');

      console.log('Sending SMS from:', from);
      console.log('Sending SMS to:', receiver);

      await this.client.messages.create({ 
         to: receiver,
         from: from, // Use the Twilio phone number from the environment variable
         body: message });
      console.log('SMS sent successfully');
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }
}
