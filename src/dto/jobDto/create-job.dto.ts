// src/job-market/dto/create-job.dto.ts
import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsArray()
  @IsNotEmpty()
  keyResponsibilities: string[];

  @IsArray()
  @IsNotEmpty()
  qualifications: string[];

  @IsString()
  @IsNotEmpty()
  workArrangement: string;

  @IsString()
  @IsNotEmpty()
  applicationUrl: string;
}


