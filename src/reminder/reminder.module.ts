import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { Reminder } from '@prisma/client'; 

@Module({
  imports: [], 
  controllers: [ReminderController],
  providers: [ReminderService, PrismaService],
})
export class ReminderModule {}
