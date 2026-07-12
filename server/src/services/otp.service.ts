import { otpRepository } from '../repositories/index.js';
import { generateOtp } from '../utils/helpers.js';
import { AppError } from '../middlewares/errorHandler.js';
import smsFactory from '../sms/sms.factory.js';
import type { OtpPurpose } from '@prisma/client';

export const otpService = {
  async sendOtp(mobileNumber: string, purpose: OtpPurpose = 'LOGIN'): Promise<string> {
    // 1. Rate limiting check (max 5 requests per hour)
    const ONE_HOUR = 3600000;
    const requestCount = await otpRepository.countRecentByMobile(mobileNumber, ONE_HOUR);
    if (requestCount >= 5) {
      throw new AppError(
        'Maximum OTP requests exceeded for this hour. Please try again later.',
        429,
        'OTP_RATE_LIMITED'
      );
    }

    // 2. Invalidate previous unused OTPs
    await otpRepository.invalidateAll(mobileNumber, purpose);

    // 3. Generate new OTP (default 123456 for demo number, secure code for others)
    const otpCode = mobileNumber === '9876543210' ? '123456' : generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    // 4. Save to DB
    await otpRepository.create({
      mobileNumber,
      otpCode,
      purpose,
      expiresAt,
    });

    // 5. Send via provider
    const provider = smsFactory.getProvider();
    const sent = await provider.sendOtp(mobileNumber, otpCode);
    if (!sent) {
      throw new AppError('Failed to send OTP via SMS', 500, 'SMS_SEND_FAILED');
    }

    return otpCode;
  },

  async verifyOtp(mobileNumber: string, otpCode: string, purpose: OtpPurpose = 'LOGIN'): Promise<boolean> {
    const record = await otpRepository.findLatestValid(mobileNumber, purpose);

    if (!record) {
      throw new AppError('OTP not requested or expired', 400, 'OTP_EXPIRED');
    }

    // Max 5 incorrect attempts
    if (record.attemptCount >= 5) {
      await otpRepository.markUsed(record.id); // Invalidate due to abuse
      throw new AppError('Maximum verification attempts exceeded. Please request a new OTP.', 400, 'OTP_MAX_ATTEMPTS');
    }

    if (record.otpCode !== otpCode) {
      await otpRepository.incrementAttempts(record.id);
      throw new AppError('Invalid OTP code', 400, 'OTP_INVALID');
    }

    // Successful verify: invalidate OTP code
    await otpRepository.markUsed(record.id);
    return true;
  },
};

export default otpService;
