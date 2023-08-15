import * as OtpGenerator from 'otp-generator';

export class OtpHelper {
  static generateOTP(length: number): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i += 1) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  static generateTrackingCode(length: number) {
    return OtpGenerator.generate(length, {
      upperCaseAlphabets: true,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
  }
}
