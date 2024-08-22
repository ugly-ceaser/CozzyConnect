import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  userId: string;

  @IsString()
  location: string;

  @IsDateString()
  time: Date;

  @IsDateString()
  date: Date;

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
  date?: Date;

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
