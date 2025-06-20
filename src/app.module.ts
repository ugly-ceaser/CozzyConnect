import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module'; 
import { ContactModule } from './contact/contact.module';
import { HotDealModule } from './hot-deal/hotDeal.module';
import { JobMarketModule } from './job/job.module';
import { MarketModule } from './market/market.module';
import { RealEstateModule } from './realEstate/realEstate.module';
import { ReminderModule } from './reminder/reminder.module';
import { ReviewModule } from './review/review.module';
import { SearchModule } from './search/search.module';
import { VerificationModule } from './verification/verification.module';
import { ReportModule } from './report/report.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/notification.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { MiddlewareService } from './middleware/middleware.service';
import { OtpService } from './otp/otp.service';
import { MailService } from './maileServices/mail.service';
import { OtpController } from './otp/otp.controller';
import { UtilsService } from './utils/utils.service';
import { ChatService } from './chat/chat.service';
import { SmsService } from './sms/sms.service';
import { AdminAuthModule } from './admin/admin.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    ChatModule, 
    ContactModule,
    HotDealModule,
    JobMarketModule,
    MarketModule,
    RealEstateModule,
    ReminderModule,
    ReviewModule,
    SearchModule,
    VerificationModule,
    ReportModule,
    NotificationModule,
    PrismaModule,
    AdminAuthModule,
  ],
  providers: [
    PrismaService,
    MiddlewareService,
    OtpService,
    MailService,
    UtilsService,
    ChatService,
    SmsService,
    NotificationService,
  ],
  controllers: [OtpController],
  exports: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MiddlewareService).forRoutes('*');
  }
}