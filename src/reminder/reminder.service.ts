import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateReminderDto, UpdateReminderDto } from '../dto/reminder';
import { NotificationService } from '../notification/notification.service';
import { formatISO, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class ReminderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  async create(createReminderDto: CreateReminderDto) {
    try {
      const { userId, title, ...rest } = createReminderDto; // Include title here
      const reminder = await this.prisma.reminder.create({
        data: {
          userId,
          title, 
          ...rest,
        },
      });
  
      // Create a notification after the reminder has been created successfully
      await this.notification.createNotification({
        userId,
        message: `Reminder has been set for: ${reminder.title}`,
        type: 'Reminder',
        priority: 'high',
        actionButtonLabel: 'View Reminder',
        actionButtonLink: `/reminders/${reminder.id}`,
        relatedResourceLink: `/reminders/${reminder.id}`,
        status: 'unread',
      });
  
      return { data: reminder, success: true };
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw new InternalServerErrorException('Could not create reminder');
    }
  }
  

  async findAll(userId: string) {
    try {
      const reminders = await this.prisma.reminder.findMany({
        where: { userId },
      });
      return { data: reminders, success: true };
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw new InternalServerErrorException('Could not fetch reminders');
    }
  }

  async findOne(reminderId: number) {
    try {
      const reminder = await this.prisma.reminder.findUnique({
        where: { id: reminderId },
      });
      if (!reminder) {
        throw new NotFoundException(`Reminder with ID ${reminderId} not found`);
      }
      return { data: reminder, success: true };
    } catch (error) {
      console.error('Error fetching reminder:', error);
      throw new InternalServerErrorException('Could not fetch reminder');
    }
  }

  async update(reminderId: number, updateReminderDto: UpdateReminderDto) {
    try {
      const existingReminder = await this.findOne(reminderId);
      if (!existingReminder.success) {
        return { data: null, success: false };
      }

      const updatedReminder = await this.prisma.reminder.update({
        where: { id: reminderId },
        data: updateReminderDto,
      });
      return { data: updatedReminder, success: true };
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw new InternalServerErrorException('Could not update reminder');
    }
  }

  async remove(reminderId: number) {
    try {
      const existingReminder = await this.findOne(reminderId);
      if (!existingReminder.success) {
        return { data: null, success: false };
      }

      await this.prisma.reminder.delete({
        where: { id: reminderId },
      });
      return { data: null, success: true };
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw new InternalServerErrorException('Could not delete reminder');
    }
  }

  // This will run every day at 8:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkRemindersDueToday(userId: string) {
    try {
      const startOfToday = startOfDay(new Date());
      const endOfToday = endOfDay(new Date());

      // Find reminders that are due today for the user
      const reminders = await this.prisma.reminder.findMany({
        where: {
          userId,
          dueDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      });

      // Create notifications for each reminder found
      for (const reminder of reminders) {
        await this.notification.createNotification({
          userId: reminder.userId,
          message: `Your reminder for "${reminder.note}" is due today.`,
          type: 'Reminder',
          priority: 'high',
          actionButtonLabel: 'View Reminder',
          actionButtonLink: `/reminders/${reminder.id}`,
          relatedResourceLink: `/reminders/${reminder.id}`,
          status: 'unread',
        });
      }

      return { data: reminders, success: true };
    } catch (error) {
      console.error('Error checking reminders due today:', error);
      throw new InternalServerErrorException('Could not check reminders due today');
    }
  }
}
