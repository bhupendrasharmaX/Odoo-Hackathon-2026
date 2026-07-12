import { z } from 'zod';

export const sendOtpSchema = z.object({
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
});

export const verifyOtpSchema = z.object({
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  otp: z
    .string()
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
