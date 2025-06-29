import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { JWTGaurd } from '../auth/gaurd';

@UseGuards(JWTGaurd)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/')
  async getNotifications(@GetUser('id') userId: string) {
    
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: number) {
    return this.notificationService.markAsRead(notificationId);
  }
}
