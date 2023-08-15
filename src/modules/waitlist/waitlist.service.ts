import { Injectable } from '@nestjs/common';
import { WaitlistUserDto } from './dto/waitlist.dto';
import { UserType } from '../../interfaces';
import { ErrorHelper } from '../../utils';
import { UserService } from '../user/user.service';
import { UsersRepository } from '../user/user.repository';
import { MailService } from '../../shared/mail/mail.service';

@Injectable()
export class WaitlistService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userService: UserService,
    private readonly mailerService: MailService
  ) {}

  async userWaitlistSignup(data: WaitlistUserDto): Promise<any> {
    let newUser;
    let emailName;

    const { firstName, lastName, businessName, fullName, email, type } = data;

    const userExist = await this.userRepository.findByEmail(email);

    if (userExist) {
      ErrorHelper.ForbiddenException('User already exist');
    }

    if (type === UserType.MERCHANT || type === UserType.MOBILE_AGENT) {
      if (!businessName || !fullName) {
        ErrorHelper.BadRequestException('Fields empty');
      }

      emailName = fullName;

      newUser = await this.userService.createWaitlistUser({
        businessName,
        fullName,
        email,
        userType: type,
        isWaitlistUser: true,
      });
    }

    if (type === UserType.FXUSERS || type === UserType.CUSTOMER) {
      if (!firstName || !lastName) {
        ErrorHelper.BadRequestException('Fields empty');
      }

      newUser = await this.userService.createWaitlistUser({
        firstName,
        lastName,
        email,
        userType: type,
        isWaitlistUser: true,
      });
    }

    const template = {
      email,
      subject: 'Welcome User',
      name: emailName,
      year: new Date().getFullYear(),
    };

    await this.mailerService.sendWelcomeEmail(template);

    return newUser;
  }

  async waitlistCount(): Promise<{ [key: string]: number }> {
    const waitlistData = await this.userService.getAllWaitlistUser();

    const countByType: { [key: string]: number } = {
      [UserType.MERCHANT]: 0,
      [UserType.CUSTOMER]: 0,
      [UserType.FXUSERS]: 0,
      [UserType.MOBILE_AGENT]: 0,
      total: 0,
    };

    waitlistData.forEach(user => {
      countByType[user.userType] += 1;
      countByType.total += 1;
    });

    return countByType;
  }
}
