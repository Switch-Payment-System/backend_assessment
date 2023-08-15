import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../user/user.repository';
import {
  DateHelper,
  ErrorHelper,
  OtpHelper,
  PasswordHelper,
  PhoneNumberHelper,
  Utils,
} from '../../utils';
import { Users } from '../user/user.entity';
import { Otp } from './otp.entity';
import { RegisterUserDto } from './signup.dto';
import { NotificationChannels, NotificationType } from '../../interfaces';
import { MailService } from '../../shared/mail/mail.service';
import { TwilioService } from '../../shared/twilio/twilio.service';
import { VerifyOtpDto } from './verify-otp.dto';
import { LoginAuthDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
    private jwtService: JwtService,
    private readonly mailerService: MailService,
    private readonly twilioService: TwilioService
  ) {}

  async registerUser(data: RegisterUserDto): Promise<Users> {
    // check if user exist
    const { email, phoneNumber } = await this.checkIfUserExist({
      email: data.email,
      phoneNumber: data.phoneNumber,
    });

    let user: any;
    let target: string;

    if (email || phoneNumber) {
      if (phoneNumber) {
        target = 'phone';
        const formattedPhoneNumber = PhoneNumberHelper.formatToCountryStandard(data.phoneNumber);
        user = await this.userRepository.findOne({
          where: { phoneNumber: formattedPhoneNumber },
        });
      }

      if (email) {
        target = 'email';
        user = await this.userRepository.findOne({
          where: { email: data.email },
        });
      }

      // check if user existed and was softly deleted
      if (user && user.deletedAt) {
        ErrorHelper.ConflictException(
          `A deleted account exists with specified ${target}. Contact support to restore`
        );
      } else {
        ErrorHelper.ConflictException(`${target} already exist`);
      }
    }

    // hash password
    const hashedPassword = await PasswordHelper.hashPassword(data.password);

    await this.createOtp(data);

    const registeredUser = await this.userRepository.save({
      ...data,
      userType: data.type,
      password: hashedPassword,
    });

    // remove password from returned data
    delete registeredUser.password;

    return registeredUser;
  }

  async signup(data: RegisterUserDto) {
    const registeredUser = await this.registerUser(data);

    return registeredUser;
  }

  async verify(data: VerifyOtpDto): Promise<Otp> {
    let userIdentifier: string;

    const query = {
      code: data.code,
      userIdentifier,
      isUsed: false,
    };

    const otp = await this.otpRepository.findOne({
      where: query,
    });

    if (!otp) {
      ErrorHelper.ForbiddenException('OTP incorrect');
    }

    if (DateHelper.isAfterCurrent(otp.expirationDate)) {
      ErrorHelper.ForbiddenException('OTP expired');
    }

    otp.isUsed = true;
    const updatedOtp = this.otpRepository.save(otp);

    return updatedOtp;
  }

  private async signUserToken(user: Users) {
    const userInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      id: user.id,
    };

    const token = this.jwtService.sign(userInfo);

    return {
      ...userInfo,
      accessToken: token,
    };
  }

  private async createOtp(data: any) {
    const code = OtpHelper.generateOTP(6);

    let userIdentifier: string;

    if (data.userIdentifier) {
      userIdentifier = data.userIdentifier;
    } else if (data.notificationChannel === NotificationChannels.EMAIL) {
      userIdentifier = Utils.isEmailOrFail(data.email);
    } else {
      userIdentifier = data.phoneNumber;
    }

    if (data.otpType === NotificationType.VERIFY_USER) {
      const userExist = await this.userRepository.findByEmailOrPhoneNumber(userIdentifier);
      if (userExist) {
        ErrorHelper.BadRequestException('User already exist');
      }
    }

    const otpPayload = {
      userIdentifier,
      code,
      expirationDate: DateHelper.addToCurrent({
        minutes: 30,
      }),
      type: data.otpType,
    };

    await this.otpRepository.save(this.otpRepository.create(otpPayload));

    await this.sendOtp(data.notificationChannel, { code, userIdentifier, type: data.otpType });

    return true;
  }

  async login(data: LoginAuthDto) {
    // useridentifier can either be phoneNumber or email
    let { userIdentifier } = data;
    let notificationChannel;

    const otpType = NotificationType.LOGIN;
    notificationChannel = NotificationChannels.EMAIL;

    if (!Utils.isEmail(data.userIdentifier)) {
      userIdentifier = data.userIdentifier;
      notificationChannel = NotificationChannels.SMS;
    }

    const registeredUser = await this.userRepository.findByEmailOrPhoneNumber(userIdentifier);

    if (!registeredUser) {
      ErrorHelper.BadRequestException('User ID specified is incorrect');
    }

    if (registeredUser && registeredUser.deletedAt) {
      ErrorHelper.BadRequestException(
        'Account associated to ID was deleted. Contact support to restore'
      );
    }

    if (registeredUser.password == null) {
      ErrorHelper.ConflictException('Unverified Waitlist User account. Please verify Account');
    }

    const isPasswordCorrect = await PasswordHelper.comparePassword(
      data.password,
      registeredUser.password
    );

    if (!isPasswordCorrect) {
      ErrorHelper.BadRequestException('Password specified is incorrect');
    }

    // send otp
    await this.createOtp({ userIdentifier, notificationChannel, otpType });

    return this.signUserToken(registeredUser);
  }

  async deleteUser({ email }: { email: string }) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      ErrorHelper.NotFoundException('User not found');
    }

    await this.userRepository.delete(user.id);

    return [];
  }

  async checkIfUserExist({ email, phoneNumber }: { email: string; phoneNumber: string }) {
    const data = {
      email: false,
      phoneNumber: false,
    };

    if (email) {
      const validEmail = Utils.isEmailOrFail(email);
      const user = await this.userRepository.count({ where: { email: validEmail } });
      data.email = user > 0;
    }

    if (phoneNumber) {
      const formattedPhoneNumber = phoneNumber;
      const user = await this.userRepository.count({
        where: {
          phoneNumber: formattedPhoneNumber,
        },
      });
      data.phoneNumber = user > 0;
    }

    return data;
  }

  private async sendOtp(
    channel: NotificationChannels,
    metadata: {
      code: string;
      userIdentifier: string;
      type: NotificationType;
    }
  ) {
    switch (channel) {
      case NotificationChannels.SMS:
        await this.twilioService.SmsVerification(
          metadata.userIdentifier,
          `Otp from PayPoint ${metadata.code}`
        );
        break;
      case NotificationChannels.EMAIL:
        if (metadata.type === NotificationType.VERIFY_USER) {
          const template = {
            code: metadata.code,
            email: metadata.userIdentifier,
            subject: 'Hello from PayPoint! Verify your account.',
            year: new Date().getFullYear(),
          };

          await this.mailerService.sendVerificationEmail(template);
        }
        return;
      default:
        ErrorHelper.BadRequestException('Invalid OTP channel');
    }
  }
}
