import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { ContactModule } from './contact/contact.module';
import { HotDealModule } from './hot-deal/hot-deal.module';
import { JobModule } from './job/job.module';
import { MarketModule } from './market/market.module';
import { RealEstateModule } from './realEstate/realEstate.module';
import { ReminderModule } from './reminder/reminder.module';
import { ReviewModule } from './review/review.module';
import { SearchModule } from './search/search.module';
import { VerificationModule } from './verification/verification.module';
import { ReportModule } from './report/report.module';
import { NotificationModule } from './notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { MiddlewareService } from './middleware/middleware.service';
import { OtpService } from './otp/otp.service';
import { MailService } from './maileServices/mail.service';
import { OtpController } from './otp/otp.controller';
import { UtilsService } from './utils/utils.service';
import { ChatService } from './chat/chat.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    AuthModule,
     UserModule, 
     ChatModule, 
     ContactModule, 
     HotDealModule, 
     JobModule, 
     MarketModule, 
     RealEstateModule, 
     ReminderModule, 
     ReviewModule, 
     SearchModule, 
     VerificationModule,
     ReportModule, 
     NotificationModule, 
     PrismaModule],
  providers: [PrismaService, MiddlewareService, OtpService,MailService, UtilsService, ChatService],
  controllers: [OtpController],
  
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the MiddlewareService for all routes
    consumer.apply(MiddlewareService).forRoutes('*');
  }
}

