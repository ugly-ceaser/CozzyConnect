import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsNotEmpty()
    @IsString()
    userId: string;
  
    @IsNotEmpty()
    @IsString()
    message: string;
  
    @IsNotEmpty()
    @IsString()
    @IsIn(['unread', 'read'])
    status: string;
  
    @IsNotEmpty()
    @IsString()
    @IsIn(['info', 'warning', 'error'])
    type: string;
  
    @IsNotEmpty()
    @IsString()
    @IsIn(['high', 'medium', 'low'])
    priority: string;
  
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
  
  