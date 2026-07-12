import type { ISmsProvider } from '../interfaces/index.js';
import { env } from '../config/env.js';
import { ConsoleSmsProvider } from './console.provider.js';
import { TwilioSmsProvider } from './twilio.provider.js';
import { Fast2SmsProvider } from './fast2sms.provider.js';

class SmsFactory {
  private providerInstance: ISmsProvider | null = null;

  getProvider(): ISmsProvider {
    if (this.providerInstance) {
      return this.providerInstance;
    }

    switch (env.SMS_PROVIDER) {
      case 'twilio':
        this.providerInstance = new TwilioSmsProvider();
        break;
      case 'fast2sms':
        this.providerInstance = new Fast2SmsProvider();
        break;
      case 'console':
      default:
        this.providerInstance = new ConsoleSmsProvider();
        break;
    }

    return this.providerInstance;
  }
}

export const smsFactory = new SmsFactory();
export default smsFactory;
