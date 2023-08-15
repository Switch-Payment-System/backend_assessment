import { ErrorHelper } from './error.utils';

export class PhoneNumberHelper {
  static formatToCountryStandard(number: string) {
    // Remove all non-digit characters from the phone number
    const cleanedNumber = number.replace(/\D/g, '');

    if (cleanedNumber.startsWith('0')) {
      // Handle numbers starting with 0 (Assuming NG or US)
      if (cleanedNumber.length === 10) {
        // Check if it's a Nigerian number (NG)
        if (
          cleanedNumber.startsWith('080') ||
          cleanedNumber.startsWith('090') ||
          cleanedNumber.startsWith('070')
        ) {
          return `+234${cleanedNumber}`;
        }
        // Assuming US for all other cases
        return `+1${cleanedNumber}`;
      }
      if (cleanedNumber.length === 11) {
        // Assuming NG for 11-digit numbers starting with 0
        return `+234${cleanedNumber.slice(1)}`;
      }
    } else if (cleanedNumber.startsWith('234')) {
      // Handle numbers starting with 234
      if (cleanedNumber.length === 13) {
        // Assuming NG for 13-digit numbers starting with 234
        return `+${cleanedNumber}`;
      }
      if (cleanedNumber.length === 14) {
        // Assuming NG for 14-digit numbers starting with 234
        return `+234${cleanedNumber.slice(3)}`;
      }
    } else if (cleanedNumber.startsWith('+234')) {
      // Handle numbers starting with +234
      if (cleanedNumber.length === 14) {
        // Assuming NG for 14-digit numbers starting with +234
        return `+${cleanedNumber.slice(1)}`;
      }
      if (cleanedNumber.length === 15) {
        // Assuming NG for 15-digit numbers starting with +234
        return `+234${cleanedNumber.slice(4)}`;
      }
    }

    // Throw an error for invalid phone numbers
    ErrorHelper.BadRequestException('Invalid phone number');
  }
}
