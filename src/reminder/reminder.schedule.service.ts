import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReminderSchedulerService {
  private readonly logger = new Logger(ReminderSchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  start() {
    cron.schedule('*/5 * * * *', async () => { // Runs every 5 minutes
      const now = new Date();
      try {
        const reminders = await this.prisma.reminder.findMany({
          where: {
            time: { lte: now },
            status: false,
          },
        });

        for (const reminder of reminders) {
          // Handle sending notifications, emails, etc.
          this.logger.log(`Reminder triggered for: ${reminder.id}`);
          
          // Update status to true after triggering
          await this.prisma.reminder.update({
            where: { id: reminder.id },
            data: { status: true },
          });
        }
      } catch (error) {
        this.logger.error('Error checking reminders', error.stack);
      }
    });
  }
}
