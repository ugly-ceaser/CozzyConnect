import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  @IsIn(['unread', 'read']) // Enforce status values
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['info', 'warning', 'error']) // Enforce specific types
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['high', 'medium', 'low']) // Enforce priority levels
  priority?: string;

  @IsOptional()
  @IsString()
  actionButtonLabel?: string;

  @IsOptional()
  @IsString()
  actionButtonLink?: string;

  @IsOptional()
  @IsString()
  relatedResourceLink?: string;
}
