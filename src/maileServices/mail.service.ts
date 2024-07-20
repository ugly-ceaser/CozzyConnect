import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // Specify your email service provider
      auth: {
        user: this.config.get<string>('EMAIL_USERNAME'), // Your email username
        pass: this.config.get<string>('EMAIL_PASSWORD'), // Your email password
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      // Define email options
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"Cozzy Connect" <${this.config.get<string>('EMAIL_USERNAME')}>`, // Sender address
        to, // List of recipients
        subject, // Subject line
        text, // Plain text body
      };

      // Send email
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
