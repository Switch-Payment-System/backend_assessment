import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { VerificationEmail, WelcomeEmail } from '../../interfaces/mail.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(options: WelcomeEmail) {
    const message = {
      to: options.email,
      subject: options.subject,
      template: './waitlist',
      context: {
        name: options.name,
        year: options.year,
      },
    };
    await this.mailerService.sendMail(message);
    Logger.log(`Email sent to ${options.email} successfully`);
  }

  async sendVerificationEmail(options: VerificationEmail) {
    const message = {
      to: options.email,
      subject: options.subject,
      template: './verifyEmail',
      context: {
        name: options.email,
        code: options.code,
        year: new Date().getFullYear(),
      },
    };
    await this.mailerService.sendMail(message);
    Logger.log(`Email sent to ${options.email} successfully`);
  }
}
