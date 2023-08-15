import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../../typeorm-extension';
import { WaitlistController } from './waitlist.controller';
import { WaitlistService } from './waitlist.service';
import { UserModule } from '../user';
import { UsersRepository } from '../user/user.repository';
import { MailModule } from '../../shared/mail/mail.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UsersRepository]),
    TypeOrmModule.forFeature([]),
    forwardRef(() => UserModule),
    MailModule,
  ],
  controllers: [WaitlistController],
  providers: [WaitlistService],
})
export class WaitlistModule {}
