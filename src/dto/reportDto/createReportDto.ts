import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  reportCategory: string;

  userId?         : string

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNotEmpty()
  @IsString()
  reportPriority: string;

 

  @IsNotEmpty()
  @IsString()
  reportableType: string;
}
