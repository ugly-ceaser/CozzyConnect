import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { ContactModule } from './contact/contact.module';
import { HotDealModule } from './hot-deal/hot-deal.module';
import { JobModule } from './job/job.module';
import { MarketModule } from './market/market.module';
import { PropertyModule } from './property/property.module';
import { ReminderModule } from './reminder/reminder.module';
import { ReviewModule } from './review/review.module';
import { SearchModule } from './search/search.module';
import { VerificationModule } from './verification/verification.module';
import { ReportModule } from './report/report.module';
import { NotificationModule } from './notification/notification.module';


@Module({
  imports: [AuthModule, UserModule, ChatModule, ContactModule, HotDealModule, JobModule, MarketModule, PropertyModule, ReminderModule, ReviewModule, SearchModule, VerificationModule, ReportModule, NotificationModule],
  
})
export class AppModule {}
