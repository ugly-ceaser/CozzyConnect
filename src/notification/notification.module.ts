import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController} from './notification.controller';

@Module({
  providers: [NotificationService],
  controllers:[ NotificationController],
  exports: [NotificationService], // Make sure to export it
})
export class NotificationModule {}
