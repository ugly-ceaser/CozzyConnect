import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateNotificationDto } from '../dto/notificationDto';
import { Prisma } from '@prisma/client';


@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(dto: CreateNotificationDto) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
            userId: dto.userId,
            message: dto.message,
            status: dto.status,
            type: dto.type,
            priority: dto.priority,
            actionButtonLabel: dto.actionButtonLabel,
            actionButtonLink: dto.actionButtonLink,
            relatedResourceLink: dto.relatedResourceLink,
          },
      });
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new InternalServerErrorException('Could not create notification');
    }
  }
  

  async getUserNotifications(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;
  
      const [notifications, total] = await this.prisma.$transaction([
        this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.notification.count({
          where: { userId },
        }),
      ]);
  
      return {
        data: notifications,
        total,
        page,
        limit,
        success: true,
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new InternalServerErrorException('Could not fetch notifications');
    }
  }
  

  async markAsRead(notificationId: number) {
    try {
      const notification = await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: 'read' },
      });
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new InternalServerErrorException('Could not update notification status');
    }
  }
}
