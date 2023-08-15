import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { NotificationChannels, NotificationType, UserType } from '../../interfaces';

export class RegisterUserDto {
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

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(NotificationChannels, {
    message: 'Invalid channel',
  })
  @IsNotEmpty()
  notificationChannel: NotificationChannels;

  @IsEnum(NotificationType, {
    message: 'Invalid OTP type',
  })
  @IsNotEmpty()
  otpType: NotificationType;

  @IsEnum(UserType, {
    message: 'Invalid user type',
  })
  @IsNotEmpty()
  type: UserType;

  @IsString()
  @IsNotEmpty()
  password: string;
}
