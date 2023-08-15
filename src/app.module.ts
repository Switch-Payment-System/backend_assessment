import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { envVarsSchema } from './helpers';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { JWT_SECRET } from './base/constants';
import { UserModule } from './modules/user';
import { WaitlistModule } from './modules/waitlist';
import { MailModule } from './shared/mail/mail.module';
import { TwilioModule } from './shared/twilio/twilio.module';
import { AuthModule } from './modules/auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envVarsSchema,
    }),
    DatabaseModule,
    AuthModule,
    WaitlistModule,
    UserModule,
    MailModule,
    {
      ...JwtModule.register({
        secret: JWT_SECRET,
        signOptions: {},
      }),
      global: true,
    },
  ],
  controllers: [AppController],
  providers: [TwilioModule],
})
export class AppModule {}
