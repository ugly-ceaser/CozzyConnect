import { Exclude, Expose } from 'class-transformer';

export class NotificationResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: string;

  @Expose()
  message: string;

  @Expose()
  createdAt: Date;

  @Expose()
  status: string;

  @Expose()
  type: string;

  @Expose()
  priority: string;

  @Expose()
  actionButtonLabel?: string;

  @Expose()
  actionButtonLink?: string;

  @Expose()
  relatedResourceLink?: string;
}
