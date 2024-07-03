import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class UpdateReviewDto {
  @IsInt()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  propertyPictures?: string[];
}
