// createUserKycDto.ts
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserKycDto {

  
  
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  passportPhoto: string[];

  @IsNotEmpty()
  @IsString()
  idType: string;

  @IsNotEmpty()
  @IsString()
  idFrontImage: string;

  @IsNotEmpty()
  @IsString()
  idBackImage: string;

  @IsOptional()
  @IsString()
  nyscNumber?: string;

  @IsNotEmpty()
  @IsString()
  nin: string;
}


