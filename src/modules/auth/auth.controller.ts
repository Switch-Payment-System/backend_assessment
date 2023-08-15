import { Body, Controller, Post, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './signup.dto';
import { HttpResponse } from '../../utils';
import { VerifyOtpDto } from './verify-otp.dto';
import { LoginAuthDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: RegisterUserDto) {
    const data = await this.authService.signup(createUserDto);

    return HttpResponse.success({ data, message: 'record created successfully' });
  }

  @Post('otp')
  async verify(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.authService.verify(verifyOtpDto);

    return HttpResponse.success({ data: '', message: 'OTP verified successfully' });
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const data = await this.authService.login(loginAuthDto);

    return HttpResponse.success({ data, message: 'User login successfully' });
  }

  @Delete('user')
  async delete(@Body() email: any) {
    const data = await this.authService.deleteUser(email);

    return HttpResponse.success({ data, message: 'User deleted successfully' });
  }
}
