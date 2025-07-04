import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class CreateReviewDto {
 
  @IsString()
  @IsOptional()
  userId: string;

  @IsInt()
  realEstateId: number;

  
  @IsInt()
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  propertyPictures?: string[];
}
