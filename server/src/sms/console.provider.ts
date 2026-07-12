import type { ISmsProvider } from '../interfaces/index.js';
import logger from '../utils/logger.js';

export class ConsoleSmsProvider implements ISmsProvider {
  async sendOtp(mobileNumber: string, otp: string): Promise<boolean> {
    logger.info(`[SMS CONSOLE PROVIDER] Sending OTP ${otp} to ${mobileNumber}`);
    console.log(`\n==================================================`);
    console.log(`[SMS OTP] Mobile: ${mobileNumber} | Code: ${otp}`);
    console.log(`==================================================\n`);
    return true;
  }
}
