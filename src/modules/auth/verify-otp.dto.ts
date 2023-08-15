import { IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  userIdentifier: string;

  @IsString()
  code: string;
}
