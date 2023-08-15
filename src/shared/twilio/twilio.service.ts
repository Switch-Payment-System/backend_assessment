import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  constructor(private config: ConfigService) {}

  async SmsVerification(userIdentifier: string, message: string) {
    const TWILIO_ACCOUNT_SID = this.config.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = this.config.get('TWILIO_AUTH_TOKEN');
    const TWILIO_PHONE_NUMBER = this.config.get('TWILIO_PHONE_NUMBER');

    const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to: userIdentifier,
      body: message,
    });

    Logger.log(`Message sent successfully to ${userIdentifier}`);
  }
}
