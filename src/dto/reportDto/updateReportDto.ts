import { IsOptional, IsString } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  reportCategory?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  reportPriority?: string;


  @IsOptional()
  @IsString()
  reportableType?: string;
}
