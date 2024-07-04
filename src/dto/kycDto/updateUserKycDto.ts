import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateUserKycDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  passportPhoto?: string[];

  @IsOptional()
  @IsString()
  idType?: string;

  @IsOptional()
  @IsString()
  idFrontImage?: string;

  @IsOptional()
  @IsString()
  idBackImage?: string;

  @IsOptional()
  @IsString()
  nyscNumber?: string;

  @IsOptional()
  @IsString()
  nin?: string;
}
