import type { ISmsProvider } from '../interfaces/index.js';
import logger from '../utils/logger.js';
import { env } from '../config/env.js';

export class TwilioSmsProvider implements ISmsProvider {
  private client: any;

  constructor() {
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
      // Lazy import or simple REST API trigger to avoid requiring npm package if not used
    }
  }

  async sendOtp(mobileNumber: string, otp: string): Promise<boolean> {
    try {
      logger.info(`Sending Twilio SMS OTP ${otp} to ${mobileNumber}`);
      if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
        logger.warn('Twilio credentials not fully configured. Falling back to console logging.');
        console.log(`[Twilio Fallback OTP] Mobile: ${mobileNumber} | Code: ${otp}`);
        return true;
      }
      
      // Implement fetch to Twilio REST API to avoid hard dependency on twilio helper library if not installed
      const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`,
          },
          body: new URLSearchParams({
            To: mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber}`,
            From: env.TWILIO_PHONE_NUMBER,
            Body: `Your TransitOps OTP code is ${otp}. It will expire in 5 minutes.`,
          }),
        }
      );

      const resData = await response.json();
      if (!response.ok) {
        logger.error('Twilio SMS sending failed', resData);
        return false;
      }

      return true;
    } catch (err) {
      logger.error('Twilio SMS send error', err);
      return false;
    }
  }
}
