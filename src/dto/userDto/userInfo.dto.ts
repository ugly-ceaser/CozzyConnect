// dto/create-user-info.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsOptional} from 'class-validator';

export class CreateUserInfoDto {
  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @IsNotEmpty()
  @IsString()
  readonly profilePicture: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly userType: string;

  @IsOptional()
  
  readonly userId: string;
}


export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  readonly fullName?: string;

  @IsOptional()
  @IsString()
  readonly  email?: string;

  @IsOptional()
  @IsString() 
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  readonly profilePicture?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly userType?: string;

  @IsOptional()

  readonly userId?: string;
}
