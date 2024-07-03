import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class ReplaceRealEstateImgDto {
  @IsString()
  oldImageUrl: string;

  @IsString()
  @IsNotEmpty()
  newImageUrl: string;

  @IsInt()
  @IsNotEmpty()
  imageIndex: number;
}
