import { Controller, Get, Query, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from '../../utils';
import { PaginationDto } from '../../queries/page-options';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('waitlist')
  async waitlistUsers(@Query() paginationDto: PaginationDto) {
    const data = await this.userService.waitlistUsers(paginationDto);

    return HttpResponse.success({ data, message: 'record fetched successfully' });
  }

  @Delete('waitlist/:id')
  async deleteWaitlistUser(@Param('id') id: string) {
    const data = await this.userService.deleteWaitlistUser(id);

    return HttpResponse.success({ data, message: 'record removed successfully' });
  }
}
