import type { ISmsProvider } from '../interfaces/index.js';
import logger from '../utils/logger.js';
import { env } from '../config/env.js';

export class Fast2SmsProvider implements ISmsProvider {
  async sendOtp(mobileNumber: string, otp: string): Promise<boolean> {
    try {
      logger.info(`Sending Fast2SMS OTP ${otp} to ${mobileNumber}`);
      if (!env.SMS_API_KEY) {
        logger.warn('Fast2SMS API key not configured. Falling back to console logging.');
        console.log(`[Fast2SMS Fallback OTP] Mobile: ${mobileNumber} | Code: ${otp}`);
        return true;
      }

      // Fast2SMS OTP API
      const response = await fetch(
        `https://www.fast2sms.com/dev/bulkV2?authorization=${env.SMS_API_KEY}&variables_values=${otp}&route=otp&numbers=${mobileNumber}`,
        {
          method: 'GET',
        }
      );

      const resData = (await response.json()) as any;
      if (!response.ok || !resData.return) {
        logger.error('Fast2SMS sending failed', resData);
        return false;
      }

      return true;
    } catch (err) {
      logger.error('Fast2SMS send error', err);
      return false;
    }
  }
}
