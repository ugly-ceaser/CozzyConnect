import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailService {

  constructor(private  config : ConfigService) {}

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // Specify your email service provider
        auth: {
          user:this.config.get('EMAIL_USERNAME'), // Your email username
          pass: this.config.get('EMAIL_PASSWORD'), // Your email password
        },
      });

      // Define email options
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"Cozzy Connect" <${process.env.EMAIL_USERNAME}>`, // Sender address
        to: to, // List of recipients
        subject: subject, // Subject line
        text: text, // Plain text body
      };

      // Send email
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }


}
