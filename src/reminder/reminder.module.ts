import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { Reminder } from '@prisma/client'; 
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule], // Import the NotificationModule here
providers: [ReminderService, PrismaService],
exports: [ReminderService], // Optional: export ReminderService if needed in other modules
})
export class ReminderModule {}


