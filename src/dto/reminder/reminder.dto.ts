import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  userId: string;

  @IsString()
  title: string; // Add this line

  @IsString()
  location: string;

  @IsDateString()
  time: Date;

  @IsDateString()
  dueDate: Date; // Ensure this matches the field in your schema

  @IsString()
  note: string;

  @IsString()
  appointmentContactNumber: string;

  @IsBoolean()
  status: boolean;
}

export class UpdateReminderDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  time?: Date;

  @IsOptional()
  @IsDateString()
  dueDate?: Date; // Ensure this matches the field in your schema

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  appointmentContactNumber?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
