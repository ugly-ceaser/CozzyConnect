import { Injectable } from "@nestjs/common";
import * as nodeMailer from 'nodemailer';
//import * as nodeMailerSmtpTransport from 'nodemailer-smtp-transport';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  
//   createEmailSender = (emailType: string) => {
//     const emailFrom = process.env.MAIL_USERNAME;
//     const emailPass = process.env.MAIL_PASS;
//     const emailHost = process.env.MAIL_HOST;
//     const emailPort = process.env.MAIL_PORT;

//     // Define mail types
//     const mailDict: { [key: string]: { subject: string, html: string } } = {
//       "sendOTPdMail": {
//         subject: "Email Verification",
//         html: './emails/verifyOtpEmail.html',
//       },
//       // Add more mail types here
//     };

//     const currentDirPath = path.dirname(__filename);
//     const filePath = path.join(currentDirPath, mailDict[emailType].html);

//     const source = fs.readFileSync(filePath, 'utf-8').toString();
//     const template = handlebars.compile(source);

//     const transporter = nodeMailer.createTransport(
//       nodeMailerSmtpTransport({
//         host: emailHost,
//         port: Number(emailPort),
//         secure: true,
//         debug: true,
//         tls: {
//           rejectUnauthorized: false
//         },
//         auth: {
//           user: emailFrom,
//           pass: emailPass,
//         },
//         maxMessages: 100
//       })
//     );

//     return function send(to: string, data: any) {
//       const mailOption: nodeMailer.SendMailOptions = {
//         from: `owllup <${emailFrom}>`,
//         to: to,
//         subject: mailDict[emailType].subject
//       };

//       data.imageUrl = `picture`;

//       const emailTemp = {
//         logoUrl: "",
//         appUrl: "",
//         helpUrl: "",
//         facebookUrl: "https://www.facebook.com",
//         twitterUrl: "https://twitter.com/",
//         instagramUrl: "https://www.instagram.com/",
//         snapchatUrl: "https://snapchat.com/",
//         linkedinUrl: "https://www.linkedin.com/",
//         youtubeUrl: "https://www.youtube.com",
//         loginUrl: "https://login.com/",
//         androidUrl: "",
//         iosUrl: "",
//       };
//       const mergedObj = { ...data, ...emailTemp };
//       mailOption.html = template(mergedObj);

//       transporter.sendMail(mailOption, function (error, info) {
//         if (error) {
//           console.log('error', error);
//         } else {
//           console.log('Email Sent', info.response);
//         }
//       });
//     };
//   }

}
