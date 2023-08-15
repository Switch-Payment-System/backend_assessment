import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserType } from '../../../interfaces';

export class WaitlistUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserType, {
    message: 'Invalid user type',
  })
  @IsNotEmpty()
  type: UserType;
}
