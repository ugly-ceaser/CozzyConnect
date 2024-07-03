import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class ReportDto {
  @IsInt()
  reportableId: number;

  @IsString()
  @IsNotEmpty()
  reportableType: string;

  @IsString()
  @IsNotEmpty()
  reportCategory: string;

  @IsString()
  @IsNotEmpty()
  reportPriority: string;
}
