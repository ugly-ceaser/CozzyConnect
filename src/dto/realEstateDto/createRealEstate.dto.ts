import { IsString, IsInt, IsArray, IsNotEmpty, IsDateString, ArrayMinSize, IsOptional } from 'class-validator';

export class CreateRealEstateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userId: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsInt()
  @IsNotEmpty()
  numberOfRooms: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  pictures: string[];

  @IsInt()
  @IsNotEmpty()
  mainPictureIndex: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  lga: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  nearby: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  amenities: string[];

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;
}
