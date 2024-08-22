import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto, UpdateReminderDto } from '../dto/reminder';

@Injectable()
export class ReminderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReminderDto: CreateReminderDto) {
    try {
      const { userId, ...rest } = createReminderDto;
      const reminder = await this.prisma.reminder.create({
        data: {
          userId,
          ...rest,
        },
      });
      return { data: reminder, success: true };
    } catch (error) {
      console.error('Error creating reminder:', error);
      return { data: null, success: false };
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
      return { data: null, success: false };
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
      return { data: null, success: false };
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
      return { data: null, success: false };
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
      return { data: null, success: false };
    }
  }
}
