import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../../typeorm-extension';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../user/user.repository';
import { Otp } from './otp.entity';
import { MailModule } from '../../shared/mail/mail.module';
import { TwilioService } from '../../shared/twilio/twilio.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UsersRepository]),
    TypeOrmModule.forFeature([Otp]),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TwilioService],
  exports: [AuthService],
})
export class AuthModule {}
