import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  userIdentifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
