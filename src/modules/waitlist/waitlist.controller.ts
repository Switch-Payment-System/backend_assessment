import { Controller, Post, Body, Get } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { HttpResponse } from '../../utils';
import { WaitlistUserDto } from './dto/waitlist.dto';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post('signup')
  async signupWaitlist(@Body() createUserDto: WaitlistUserDto) {
    const data = await this.waitlistService.userWaitlistSignup(createUserDto);

    return HttpResponse.success({ data, message: 'record created successfully' });
  }

  @Get()
  async waitlistCount() {
    const data = await this.waitlistService.waitlistCount();

    return HttpResponse.success({ data, message: 'record fetched successfully' });
  }
}
